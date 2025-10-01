import { Product } from "../../../../entities/Product";


export type UpdateProductPayload = Partial<Product> & {id: number};

export type UpdateProductRestockPayload = Pick<Product, 'id' | 'stock'>