import { Cart } from "../entities/Cart";
import { CartItem } from "../entities/CartItem";
import { Customer } from "../entities/Customer";
import { Order } from "../entities/Order";
import { Product } from "../entities/Product";
import { DatabaseManager } from "./database.service";

export type AddToCart = {
    customer: Customer,
    product: Product
}

export class CartService {
    private static instance: CartService;


    private constructor(private readonly database: DatabaseManager) { }

    public static getInstance(): CartService {
        if (!this.instance) {
            const database = DatabaseManager.getInstance();
            this.instance = new CartService(database);
        }
        return this.instance;
    }

    async addToCart(payload: AddToCart): Promise<Cart> {
        const repository = DatabaseManager.getRepository(Cart);
        let cart = await repository.findOne({
            where: { customer: { id: payload.customer.id } },
            relations: ['items']
        });

        if (!cart) {
           cart = new Cart(); 
           cart.customer = payload.customer;
           cart.items = []
        }
        const product = await DatabaseManager.getRepository(Product).findOneBy({id: payload.product.id});
        // TODO: try catch;
        
        // quantity:
        const cartItem = DatabaseManager.getRepository(CartItem).create({
            product: product as Product, // TODO: change later,
            quantity: 1,
        })

        cart.items.push(cartItem);
        cart.totalPrice = cart.items.reduce((acc, c) => acc + c.product.price, 0);
        cart.totalQuantity = cart.items.reduce((acc, c) => acc + c.quantity, 0);
        return await repository.save(cart);
    }
}

