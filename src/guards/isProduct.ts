import { Product } from "../entities/product";

export function isProduct(entity: unknown): entity is Product {
    return entity instanceof Product
}