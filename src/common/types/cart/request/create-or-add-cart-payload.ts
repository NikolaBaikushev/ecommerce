import { Customer } from "../../../../entities/Customer"
import { Product } from "../../../../entities/Product"

export type CreateOrAddCartPayload = {
    customer: Customer,
    product: Product
}
