import { UpdateResult } from "typeorm";
import { Order, OrderStatus } from "../entities/Order";
import { OrderItem } from "../entities/OrderItem";
import { DatabaseManager } from "./database.service";
import { ProductService } from "./product.service";
import { Notify } from "../common/decorators/notify";
import { SuccessEventName, ErrorEventName } from "../common/events/notify-events";
import { CreateOrderPayload } from "../common/types/order/request/create-order-payload";
import { UpdateOrderPayload } from "../common/types/order/request/update-order-payload";
import { CompleteOrderResponse } from "../common/types/order/response/complete-order-response";
import { GetPayload } from "../common/types/domain/get";
import { OnEvent } from "../common/decorators/on-event";
import { Operations } from "./event-handler.service";
import { Logger } from "./logger.service";

export class OrderService {
    static #instance: OrderService;
    private logger: Logger = Logger.getInstance();
    private constructor(private readonly database: DatabaseManager, private readonly productService: ProductService,) { }

    public static getInstance(): OrderService {
        if (!this.#instance) {
            const database = DatabaseManager.getInstance();
            this.#instance = new OrderService(database, ProductService.getInstance());
        }
        return this.#instance;
    }

    public async getOrderById(payload: GetPayload): Promise<Order | null> {
        const repository = DatabaseManager.getRepository(Order);
        return repository.findOne({
            where: { id: payload.id },
            relations: [...(payload?.relations ?? [])]
        })
    }

    @Notify(SuccessEventName.ORDER_CREATED, ErrorEventName.ERROR_ORDER_CREATED)
    public async createOrder(payload: CreateOrderPayload): Promise<Order> {
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
    public async completeOrder(order: Order): Promise<CompleteOrderResponse> {
        if (order.status === OrderStatus.COMPLETED) {
            throw new Error('Order Already Completed!')
        }
        const productQuantities = order.items.reduce((acc, item) => {
            const productId = item.product.id;
            const currentQty = acc.get(productId) ?? 0;
            acc.set(productId, currentQty + item.quantity);
            return acc;
        }, new Map<number, number>());

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


    public async updateOrder(payload: UpdateOrderPayload): Promise<UpdateResult> {
        return DatabaseManager.getRepository(Order).update({ id: payload.id }, payload);
    }



    // TODO: Do the same for the other service nad entities, use typescript ...
    public getOrderSummary() {

    }

    private applyDiscount(total: number, discountPercent: number): number {
        return Number((total * (1 - discountPercent / 100)).toFixed(2));
    }


    @OnEvent(SuccessEventName.ORDER_CREATED)
    handleOrderCreated(order: Order) {
        this.logger.neutral(`=== OPERATION: ${Operations.CREATE_ORDER} FINISHED ===`)
        this.logger.bgSuccess(`=== RESULT: Order created with ID: ${order.id} ===`)
        this.logger.bgYellow(`=== RESULT ITEMS: ===`)
        for (const item of order) {
            this.logger.yellow(`\t +++ Order Item ID: ${item.id} +++`)
        }
    }

    @OnEvent(ErrorEventName.ERROR_ORDER_CREATED)
    handleOrderCreatedError(error: Error) {
        this.logger.fail(`=== OPERATION: ${Operations.CREATE_ORDER} FAILED ===, ${error}`)
    }

    @OnEvent(SuccessEventName.ORDER_COMPLETED)
    handleOrderCompleted(data: CompleteOrderResponse) {
        this.logger.neutral(`=== Operation: ${Operations.COMPLETE_ORDER} FINISHED ===`);
        this.logger.bgYellow(`=== RESULT STATUS BEFORE COMPLETION: ${data?.beforeCompleteOrder?.status}`)
        this.logger.bgYellow(`=== RESULT STATUS AFTER COMPLETION: ${data?.afterCompleteOrder?.status}`)
    }

    @OnEvent(ErrorEventName.ERROR_ORDER_COMPLETED)
    handleOrderCompletedError(error: Error) {
        this.logger.fail(`=== OPERATION: ${Operations.COMPLETE_ORDER} FAILED ===, ${error}`)
    }
}

