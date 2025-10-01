import { UpdateResult } from "typeorm";
import { Product } from "../entities/Product";
import { DatabaseManager } from "./database.service";
import { GetPayload } from "./store";
import { ErrorEventName, Notifier, Notify, SuccessEventName } from "./notifier.service";

export type CreateProductPayload = {
    name: string,
    price: number,
    description?: string,
    stock?: number
}


export type UpdateProductPayload = Partial<Product> & {id: number};

export class ProductService {
    private static instance: ProductService;


    private constructor(private readonly database: DatabaseManager) { }

    public static getInstance(): ProductService {
        if (!this.instance) {
            const database = DatabaseManager.getInstance();
            this.instance = new ProductService(database);
        }
        return this.instance;
    }

    async getProductById(payload: GetPayload): Promise<Product | null> {
        const repository = DatabaseManager.getRepository(Product);
        return repository.findOne({
            where: { id: payload.id },
            relations: [...(payload?.relations ?? [])]
        })
    }

    @Notify(SuccessEventName.PRODUCT_CREATED, ErrorEventName.ERROR_PRODUCT_CREATED)
    async createProduct(payload: CreateProductPayload): Promise<Product> {
        const repository = DatabaseManager.getRepository(Product)
        const product: Product = repository.create(payload);
        const savedProduct = await repository.save(product);
        return savedProduct;
    }


    @Notify(SuccessEventName.PRODUCT_UPDATED, ErrorEventName.ERROR_PRODUCT_UPDATED)
    async updateProduct(payload: UpdateProductPayload): Promise<UpdateResult> {
        const beforeProduct = this.getProductById({id: payload.id});

        const update = DatabaseManager.getRepository(Product).update({ id: payload.id } , payload);
        const afterProduct = this.getProductById({id: payload.id});
        return update;
    }

}

