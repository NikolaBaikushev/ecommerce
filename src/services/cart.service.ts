import { Notify } from "../common/decorators/notify";
import { OnEvent } from "../common/decorators/on-event";
import { SuccessEventName, ErrorEventName } from "../common/events/notify-events";
import { CreateOrAddCartPayload } from "../common/types/cart/request/create-or-add-cart-payload";
import { Cart } from "../entities/Cart";
import { CartItem } from "../entities/CartItem";
import { DatabaseManager } from "./database.service";
import { Operations } from "./event-handler.service";
import { Logger } from "./logger.service";
export class CartService {
    static #instance: CartService;
    private logger: Logger = Logger.getInstance();

    private constructor(private readonly database: DatabaseManager) { }

    public static getInstance(): CartService {
        if (!this.#instance) {
            const database = DatabaseManager.getInstance();
            this.#instance = new CartService(database);
        }
        return this.#instance;
    }

    public async getCartByCustomerId(customerId: number) {
        return await DatabaseManager.getRepository(Cart).findOne({
            where: {
                customer: { id: customerId }
            },
            relations: ['items', 'items.product']
        })
    }

    @Notify(SuccessEventName.CART_CREATED, ErrorEventName.ERROR_CART_CREATED)
    public async addToCart(payload: CreateOrAddCartPayload): Promise<Cart> {
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


    @OnEvent(SuccessEventName.CART_CREATED)
    handleCartCreated(cart: Cart) {

        this.logger.yellow(`=== RESULT: \n ${cart.toPrint()}`)
        this.logger.neutral(`=== OPERATION: ${Operations.ADD_TO_CART} FINISHED ===`)
    }

    @OnEvent(ErrorEventName.ERROR_CART_CREATED)
    handleCartCreatedError(error: Error) {
        this.logger.fail(`=== OPERATION: ${Operations.ADD_TO_CART} FAILED ===, ${error}`)
    }
}

