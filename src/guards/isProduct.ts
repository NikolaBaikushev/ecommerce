import { Product } from "../entities/Product";

export function isProduct(entity: unknown): entity is Product {
    return entity instanceof Product
}