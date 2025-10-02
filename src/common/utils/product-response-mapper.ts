import { Product } from "../../entities/Product";
import { FakestoreAPIProductResponse } from "../types/product/response/product-api-response"

export class Mapper {
    public static toProduct(data:FakestoreAPIProductResponse): Product {
        const product = new Product();
        product.id = data.id;
        product.name = data.title;
        product.description = data.description;
        product.price = data.price;
        product.stock = 0;
        return product;
    }
}