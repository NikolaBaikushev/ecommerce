    import { Cart } from "../entities/Cart";
    import { CartItem } from "../entities/CartItem";
    import { Customer } from "../entities/Customer";
    import { Order } from "../entities/Order";
    import { Product } from "../entities/Product";
    import { DatabaseManager } from "./database.service";
import { ErrorEventName, Notify, SuccessEventName } from "./notifier.service";

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

        @Notify(SuccessEventName.CART_CREATED, ErrorEventName.ERROR_CART_CREATED)
        async addToCart(payload: AddToCart): Promise<Cart> {
            const repository = DatabaseManager.getRepository(Cart);
            let cart = await repository.findOne({
                where: { customer: { id: payload.customer.id } },
                relations: ['items', 'items.product']
            });

            if (!cart) {
                cart = new Cart(); 
                cart.customer = payload.customer;
                cart.items = []
            }
            
            const cartItem = DatabaseManager.getRepository(CartItem).create({
                product: payload.product,
                quantity: 1,
            })

            cartItem.cart = cart;

            cart.items.push(cartItem);
            cart.totalPrice = cart.items.reduce((acc, c) => acc + c.product.price, 0);
            cart.totalQuantity = cart.items.reduce((acc, c) => acc + c.quantity, 0);
            return await repository.save(cart);
        }
    }

