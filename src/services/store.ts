import { UpdateResult } from "typeorm";
import { Cart } from "../entities/Cart";
import { EntityType, EntityMap } from "../common/types/domain/core";
import { CreatePayloadMap } from "../common/types/domain/create";
import { UpdatePayloadMap } from "../common/types/domain/update";
import { CreateOrderPayload } from "../common/types/order/request/create-order-payload";
import { CompleteOrderResponse } from "../common/types/order/response/complete-order-response";
import { CreateProductPayload } from "../common/types/product/request/create-product-payload";
import { UpdateProductPayload, UpdateProductRestockPayload } from "../common/types/product/request/update-product-payload";
import { Order } from "../entities/Order";
import { OrderService } from "./order.service";
import { ProductService } from "./product.service";
import { GetPayload } from "../common/types/domain/get";
import { CreateCustomerPayload } from "../common/types/customer/request/create-customer-payload";
import { CartService } from "./cart.service";
import { CustomerService } from "./customer.service";
import { CreateOrAddCartPayload } from "../common/types/cart/request/create-or-add-cart-payload";

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
            case EntityType.PRODUCT:
                return await this.productService.updateProduct(payload as UpdateProductPayload) as any
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
                return this.orderService.getOrderById(payload) as Promise<EntityMap[T] | null>;
            default:
                return null;
        }
    }

    public async addToCart(payload: CreateOrAddCartPayload): Promise<Cart> {
        return await this.cartService.addToCart(payload);
    }

    public async completeOrder(order: Order): Promise<CompleteOrderResponse> {
        return await this.orderService.completeOrder(order);
    }

    public async productRestock(payload: UpdateProductRestockPayload) {
        return await this.productService.productRestock(payload);
    }
}