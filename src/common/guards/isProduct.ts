import { Product } from "../entities/Product";

export function isProduct(obj: any): obj is Product {
    return obj &&
        typeof obj.id === 'number'
        &&
        typeof obj.name === 'string'
        &&
        typeof obj.price === 'number'
        &&
        typeof obj.description === 'string'
        &&
        typeof obj.stock === 'number'
}