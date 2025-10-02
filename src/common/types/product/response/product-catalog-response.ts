import { Product } from "../../../../entities/Product"

export type ProductCatalog = {
    apiProducts: Product[],
    dbProducts: Product[]
}