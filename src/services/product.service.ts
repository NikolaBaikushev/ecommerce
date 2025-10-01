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



export type ProductRestockResponse = {
    beforeUpdateProduct: Product,
    afterUpdateProduct: Product
}



export type UpdateProductPayload = Partial<Product> & {id: number};

export type UpdateProductRestockPayload = Pick<Product, 'id' | 'stock'>

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
        return DatabaseManager.getRepository(Product).update({ id: payload.id } , payload);
    }

    @Notify(SuccessEventName.PRODUCT_RESTOCK, ErrorEventName.ERROR_PRODUCT_RESTOCK)
    async productRestock(payload: UpdateProductRestockPayload): Promise<ProductRestockResponse> {
        try {
            const product = await this.getProductById({ id: payload.id });
            if (!product) {
                throw new Error(`Product with ID: ${payload.id} NOT FOUND!`)
            } else {
                const updatePayload: UpdateProductPayload = {
                    id: product.id,
                    stock: product.stock + payload.stock 
                }

                try { 
                    await this.updateProduct(updatePayload);
                } catch (err) {
                    throw err
                }

                const updatedProduct = await this.getProductById({ id: payload.id })
                if (!updatedProduct) {
                    throw new Error(`Product with ID: ${payload.id} NOT FOUND!`)
                }
                return {
                    beforeUpdateProduct: product,
                    afterUpdateProduct: updatedProduct
                }
            }
        } catch (error) {
            throw error;
        }
    }

}

