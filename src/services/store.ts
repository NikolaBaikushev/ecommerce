import { Customer } from "../entities/Customer";
import { Product } from "../entities/Product";
import { CustomerService } from "./customer.service";
import { ProductService } from "./product.service";

export enum EntityType {
    PRODUCT,
    CUSTOMER,
}

type EntityMap = {
    [EntityType.PRODUCT]: Product,
    [EntityType.CUSTOMER]: Customer,
}

export class StoreManager {
    static #instance: StoreManager;

    private constructor(
        private readonly productService: ProductService,
        private readonly customerService: CustomerService) { }

    public static getInstance() {
        if (!this.#instance) {
            this.#instance = new StoreManager(ProductService.getInstance(), CustomerService.getInstance());
        }
        return this.#instance;
    }


    public async create<T extends EntityType>(entityType: T): Promise<Awaited<EntityMap[T]>> {
        switch (entityType) {
            case EntityType.CUSTOMER:
                return await this.customerService.createCustomer() as Awaited<EntityMap[T]>;
            case EntityType.PRODUCT:
                return await this.productService.createProduct() as Awaited<EntityMap[T]>;
            default:
                throw new Error('Invalid entity type');
        }
    }
}