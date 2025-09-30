import { Entity, UpdateResult } from "typeorm";
import { Cart } from "../entities/Cart";
import { Customer } from "../entities/Customer";
import { Product } from "../entities/Product";
import { AddToCart, CartService } from "./cart.service";
import { CreateCustomerPayload, CustomerService } from "./customer.service";
import { CreateProductPayload, ProductService, UpdateProductPayload } from "./product.service";
import { CreateOrderPayload, OrderService } from "./order.service";
import { Order } from "../entities/Order";

export enum EntityType {
    PRODUCT,
    CUSTOMER,
    ORDER,
}

type EntityMap = {
    [EntityType.PRODUCT]: Product,
    [EntityType.CUSTOMER]: Customer,
    [EntityType.ORDER]: Order,
}

type CreatePayloadMap = {
    [EntityType.PRODUCT]: CreateProductPayload,
    [EntityType.CUSTOMER]: CreateCustomerPayload
    [EntityType.ORDER]: CreateOrderPayload
}
type UpdatePayloadMap = {
    [EntityType.PRODUCT]: UpdateProductPayload,
    [EntityType.CUSTOMER]: undefined,
    [EntityType.ORDER]: undefined
}


export type GetPayload = {
    id: number,
    relations?: string[]
}

type EntityConstructor<T> = { new(): T }

export class StoreManager {
    static #instance: StoreManager;

    private constructor(
        private readonly productService: ProductService,
        private readonly customerService: CustomerService,
        private readonly cartService: CartService,
        private readonly orderService: OrderService,
    ) { }

    public static getInstance() {
        if (!this.#instance) {
            this.#instance = new StoreManager(ProductService.getInstance(), CustomerService.getInstance(), CartService.getInstance(), OrderService.getInstance());
        }
        return this.#instance;
    }


    public async create<T extends EntityType>(entityType: T, payload: CreatePayloadMap[T]): Promise<Awaited<EntityMap[T]>> {
        switch (entityType) {
            case EntityType.CUSTOMER:
                return await this.customerService.createCustomer(payload as CreateCustomerPayload) as Awaited<EntityMap[T]>;
            case EntityType.PRODUCT:
                return await this.productService.createProduct(payload as CreateProductPayload) as Awaited<EntityMap[T]>;
            case EntityType.ORDER:
                return await this.orderService.createOrder(payload as CreateOrderPayload) as Awaited<EntityMap[T]>;
            default:
                throw new Error('Invalid entity type');
        }
    }
    public async update<T extends EntityType>(entityType: T, payload: UpdatePayloadMap[T]): Promise<UpdateResult> {
        switch (entityType) {
            // case EntityType.CUSTOMER:
            //     return await this.customerService.createCustomer(payload as CreateCustomerPayload) as Awaited<EntityMap[T]>;
            case EntityType.PRODUCT:
                return await this.productService.updateProduct( payload as UpdateProductPayload) as any
            // case EntityType.ORDER:
            //     return await this.orderService.createOrder(payload as CreateOrderPayload) as Awaited<EntityMap[T]>;
            default:
                throw new Error('Invalid entity type');
        }
    }

    public async getEntityById<T extends EntityType>(
        entityType: T,
        payload: GetPayload
    ): Promise<EntityMap[T] | null> {
        switch (entityType) {
            case EntityType.CUSTOMER:
                return this.customerService.getCustomerById(payload) as Promise<EntityMap[T] | null>;
            case EntityType.PRODUCT:
                return this.productService.getProductById(payload) as Promise<EntityMap[T] | null>;
            case EntityType.ORDER:
                // return this.orderService.getProductById(payload) as Promise<EntityMap[T] | null>;
            default:
                return null;
        }
    }

    public async addToCart(payload: AddToCart): Promise<Cart> {
        return await this.cartService.addToCart(payload);
    }
}