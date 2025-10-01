import { UpdateResult } from "typeorm";
import { Order, OrderStatus } from "../entities/Order";
import { OrderItem } from "../entities/OrderItem";
import { DatabaseManager } from "./database.service";
import { Logger } from "./logger.service";
import { ProductService } from "./product.service";
import { Notify } from "../common/decorators/notify";
import { SuccessEventName, ErrorEventName } from "../common/events/notify-events";
import { CreateOrderPayload } from "../common/types/order/request/create-order-payload";
import { UpdateOrderPayload } from "../common/types/order/request/update-order-payload";
import { CompleteOrderResponse } from "../common/types/order/response/complete-order-response";
import { GetPayload } from "../common/types/domain/get";

export class OrderService {
    private static instance: OrderService;
    private logger: Logger = Logger.getInstance();


    private constructor(private readonly database: DatabaseManager, private readonly productService: ProductService,) { }

    public static getInstance(): OrderService {
        if (!this.instance) {
            const database = DatabaseManager.getInstance();
            this.instance = new OrderService(database, ProductService.getInstance());
        }
        return this.instance;
    }

    async getOrderById(payload: GetPayload): Promise<Order | null> {
        const repository = DatabaseManager.getRepository(Order);
        return repository.findOne({
            where: { id: payload.id },
            relations: [...(payload?.relations ?? [])]
        })
    }

    @Notify(SuccessEventName.ORDER_CREATED, ErrorEventName.ERROR_ORDER_CREATED)
    async createOrder(payload: CreateOrderPayload): Promise<Order> {
        const cart = payload.customer.cart;

        const order = DatabaseManager.getRepository(Order).create({
            customer: payload.customer,
            total: cart.totalPrice,
        })

        if (payload.customer.isPremium) {
            order.total = this.applyDiscount(order.total, 20);
        }

        order.items = cart.items.map(cartItem => {
            const orderItem = new OrderItem();
            orderItem.product = cartItem.product;
            orderItem.quantity = cartItem.quantity;
            return orderItem;
        })

        return await DatabaseManager.getRepository(Order).save(order);
    }


    @Notify(SuccessEventName.ORDER_COMPLETED, ErrorEventName.ERROR_ORDER_COMPLETED)
    async completeOrder(order: Order): Promise<CompleteOrderResponse> {
        if (order.status === OrderStatus.COMPLETED) {
            throw new Error('Order Already Completed!')
        }
        const productQuantities = order.items.reduce((acc, item) => {
            const productId = item.product.id;
            const currentQty = acc.get(productId) ?? 0;
            acc.set(productId, currentQty + item.quantity);
            return acc;
        },new Map<number, number>());

        const errors = [];

        for (const [id, total] of productQuantities.entries()) {
            const product = await this.productService.getProductById({ id });
            if (!product) {
                errors.push(`Product with ID ${id} was not found.`)
                continue
            }

            if (product.stock >= total) {
                await this.productService.updateProduct({ id: id, stock: product.stock - total })
            } else {
                errors.push(`"Product ${product.name}" with ID: ${product.id} has only ${product.stock} in stock but needs ${total}.`)
                continue
            }
        }

        if (errors.length > 0) {
            const message = `Order cannot be fulfilled! Issues: ${errors.join(`\n`)}`
            throw new Error(message);
        }


            await this.updateOrder({ id: order.id, status: OrderStatus.COMPLETED });

        const updatedOrder = await this.getOrderById({ id: order.id, relations: ['items', 'items.product'] });
        if (!updatedOrder) {
            throw new Error(`Product with ID: ${order.id} NOT FOUND!`)
        }
        return {
            beforeCompleteOrder: order,
            afterCompleteOrder: updatedOrder,
        }
    }


    async updateOrder(payload: UpdateOrderPayload): Promise<UpdateResult> {
        return DatabaseManager.getRepository(Order).update({ id: payload.id }, payload);
    }

    private applyDiscount(total: number, discountPercent: number): number {
        return Number((total * (1 - discountPercent / 100)).toFixed(2));
    }

    // TODO: Do the same for the other service nad entities, use typescript ...
    public getOrderSummary() {

    }
}

