import { UpdateResult } from "typeorm";
import { Product } from "../entities/Product";
import { DatabaseManager } from "./database.service";
import { Notify } from "../common/decorators/notify";
import { SuccessEventName, ErrorEventName } from "../common/events/notify-events";
import { CreateProductPayload } from "../common/types/product/request/create-product-payload";
import { UpdateProductPayload, UpdateProductRestockPayload } from "../common/types/product/request/update-product-payload";
import { ProductRestockResponse } from "../common/types/product/response/product-restock-response";
import { GetPayload } from "../common/types/domain/get";


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
        return DatabaseManager.getRepository(Product).update({ id: payload.id }, payload);
    }

    @Notify(SuccessEventName.PRODUCT_RESTOCK, ErrorEventName.ERROR_PRODUCT_RESTOCK)
    async productRestock(payload: UpdateProductRestockPayload): Promise<ProductRestockResponse> {
        const product = await this.getProductById({ id: payload.id });
        if (!product) {
            throw new Error(`Product with ID: ${payload.id} NOT FOUND!`)
        } else {
            const updatePayload: UpdateProductPayload = {
                id: product.id,
                stock: product.stock + payload.stock
            }

            await this.updateProduct(updatePayload);

            const updatedProduct = await this.getProductById({ id: payload.id })
            if (!updatedProduct) {
                throw new Error(`Product with ID: ${payload.id} NOT FOUND!`)
            }
            return {
                beforeUpdateProduct: product,
                afterUpdateProduct: updatedProduct
            }
        }
    }

}

