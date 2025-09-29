import { Cart } from "../entities/Cart";
import { Customer } from "../entities/Customer";
import { Product } from "../entities/Product";
import { AddToCart, CartService } from "./cart.service";
import { CreateCustomerPayload, CustomerService } from "./customer.service";
import { CreateProductPayload, ProductService } from "./product.service";

export enum EntityType {
    PRODUCT,
    CUSTOMER,
}

type EntityMap = {
    [EntityType.PRODUCT]: Product,
    [EntityType.CUSTOMER]: Customer,
}

type CreatePayloadMap = {
    [EntityType.PRODUCT]: CreateProductPayload,
    [EntityType.CUSTOMER]: CreateCustomerPayload
}



export class StoreManager {
    static #instance: StoreManager;

    private constructor(
        private readonly productService: ProductService,
        private readonly customerService: CustomerService,
        private readonly cartService: CartService) { }

    public static getInstance() {
        if (!this.#instance) {
            this.#instance = new StoreManager(ProductService.getInstance(), CustomerService.getInstance(), CartService.getInstance());
        }
        return this.#instance;
    }


    public async create<T extends EntityType>(entityType: T, payload: CreatePayloadMap[T]): Promise<Awaited<EntityMap[T]>> {
        switch (entityType) {
            case EntityType.CUSTOMER:
                return await this.customerService.createCustomer(payload as CreateCustomerPayload) as Awaited<EntityMap[T]>;
            case EntityType.PRODUCT:
                return await this.productService.createProduct(payload as CreateProductPayload) as Awaited<EntityMap[T]>;
            default:
                throw new Error('Invalid entity type');
        }
    }

    public async addToCart(payload: AddToCart): Promise<Cart> {
        return await this.cartService.addToCart(payload);
    }
}