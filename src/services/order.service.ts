import { UpdateResult } from "typeorm";
import { Customer } from "../entities/Customer";
import { Order, OrderStatus } from "../entities/Order";
import { OrderItem } from "../entities/OrderItem";
import { Product } from "../entities/Product";
import { DatabaseManager } from "./database.service";
import { Logger } from "./logger.service";
import { ProductService } from "./product.service";
import { GetPayload } from "./store";

export type CreateOrderPayload = {
    customer: Customer
}


export type UpdateOrderPayload = Partial<Order> & {id: number};

export class OrderService {
    private static instance: OrderService;
    private logger: Logger = Logger.getInstance();
    

    private constructor(private readonly database: DatabaseManager,private readonly productService: ProductService,) { }

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

    async completeOrder(order: Order) {
        if (order.status === OrderStatus.COMPLETED) {
            throw new Error('Order Already Completed!')
        }
        const productQuantities = order.items.reduce((acc, item) => {
            const productId = item.product.id;
            const currentQty = acc.get(productId) ?? 0;
            acc.set(productId, currentQty + item.quantity);
            return acc;
        },
        new Map<number, number>());

        for (const [id, total] of productQuantities.entries()) {
            const product = await this.productService.getProductById({id});
            if (!product) {
                this.logger.fail(`Product with ID ${id} was not found. Skipping...`);
                continue
            }

            if (product.stock >= total) {
                await this.productService.updateProduct({ id: id, stock: product.stock - total})
            } else {
                this.logger.fail(`Product "${product.name}" with ID: ${product.id} has insufficient stock!`)
                this.logger.fail(`== Current Stock: ${product.stock} - Stock to Buy: ${total}`)
                continue
            }
        }

       return await this.updateOrder({id: order.id, status: OrderStatus.COMPLETED});
       
    }


    async updateOrder(payload: UpdateOrderPayload): Promise<UpdateResult> {
        return DatabaseManager.getRepository(Order).update({ id: payload.id } , payload);
    }



    private applyDiscount(total: number, discountPercent: number): number {
        return Number((total * (1 - discountPercent / 100)).toFixed(2));
    }

    // TODO: Do the same for the other service nad entities, use typescript ...
    public getOrderSummary() {

    }
}

