import { Product } from "../../../../entities/Product"


export type ProductRestockResponse = {
    beforeUpdateProduct: Product,
    afterUpdateProduct: Product
}
