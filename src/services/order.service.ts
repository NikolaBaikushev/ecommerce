import { Customer } from "../entities/Customer";
import { Order } from "../entities/Order";
import { OrderItem } from "../entities/OrderItem";
import { Product } from "../entities/Product";
import { DatabaseManager } from "./database.service";
import { GetPayload } from "./store";

export type CreateOrderPayload = {
    customer: Customer
}

export class OrderService {
    private static instance: OrderService;


    private constructor(private readonly database: DatabaseManager) { }

    public static getInstance(): OrderService {
        if (!this.instance) {
            const database = DatabaseManager.getInstance();
            this.instance = new OrderService(database);
        }
        return this.instance;
    }

    async createOrder(payload: CreateOrderPayload): Promise<Order> {
        const cart = payload.customer.cart;
        
        const order = DatabaseManager.getRepository(Order).create({
            customer: payload.customer,
            total: cart.totalPrice,
        })
        order.items = cart.items.map(cartItem => {
            const orderItem = new OrderItem();
            orderItem.product = cartItem.product;
            orderItem.quantity = cartItem.quantity;
            return orderItem;
        })

        return await DatabaseManager.getRepository(Order).save(order);
    }
}

