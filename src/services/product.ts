import { Product } from "../entities/product";
import { DatabaseManager } from "./database";


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

    async createProduct(): Promise<Product> {
        const repository = DatabaseManager.getRepository(Product)
        const product: Product = repository.create({
            name: 'Product Test',
            price: 1.50
        })

        return repository.save(product);
    }
}

