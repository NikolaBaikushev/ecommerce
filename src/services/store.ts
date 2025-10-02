import { Cart } from "../entities/Cart";
import { EntityType, EntityMap } from "../common/types/domain/core";
import { CreateOrderPayload } from "../common/types/order/request/create-order-payload";
import { CompleteOrderResponse } from "../common/types/order/response/complete-order-response";
import { CreateProductPayload } from "../common/types/product/request/create-product-payload";
import { UpdateProductPayload, UpdateProductRestockPayload } from "../common/types/product/request/update-product-payload";
import { Order } from "../entities/Order";
import { OrderService } from "./order.service";
import { ProductService } from "./product.service";
import { GetPayload } from "../common/types/domain/get";
import { CreateCustomerPayload } from "../common/types/customer/request/create-customer-payload";
import { CartService } from "./cart.service";
import { CustomerService } from "./customer.service";
import { CreateOrAddCartPayload } from "../common/types/cart/request/create-or-add-cart-payload";
import { isProduct } from "../guards/isProduct";
import { FakestoreAPIProductResponse } from "../common/types/product/response/product-api-response";
import { Mapper } from "../common/utils/product-response-mapper";
import { Product } from "../entities/Product";
import { ProductCatalog } from "../common/types/product/response/product-catalog-response";
import { Customer } from "../entities/Customer";
import { ProductRestockResponse } from "../common/types/product/response/product-restock-response";

export class StoreManager {
    static #instance: StoreManager;

    private constructor(
        private readonly productService: ProductService,
        private readonly customerService: CustomerService,
        private readonly cartService: CartService,
        private readonly orderService: OrderService,
    ) { }

    public static getInstance() {
        if (!this.#instance) {
            this.#instance = new StoreManager(ProductService.getInstance(), CustomerService.getInstance(), CartService.getInstance(), OrderService.getInstance());
        }
        return this.#instance;
    }


    public async getEntityById<T extends EntityType>(
        entityType: T,
        payload: GetPayload
    ): Promise<EntityMap[T] | null> {
        switch (entityType) {
            case EntityType.CUSTOMER:
                return this.customerService.getCustomerById(payload) as Promise<EntityMap[T] | null>;
            case EntityType.PRODUCT:
                return this.productService.getProductById(payload) as Promise<EntityMap[T] | null>;
            case EntityType.ORDER:
                return this.orderService.getOrderById(payload) as Promise<EntityMap[T] | null>;
            default:
                return null;
        }
    }

    public async getProductsCatalog(): Promise<ProductCatalog> {
        const data: FakestoreAPIProductResponse[] = await fetch('https://fakestoreapi.com/products').then(data => data.json());
        const apiProducts: Product[] = data.filter(p => !isProduct(p)).map(p => Mapper.toProduct(p));
        const dbProducts: Product[] = await this.productService.getAll();

        return {
            apiProducts,
            dbProducts
        }
    }

    public async registerCustomer(payload: CreateCustomerPayload): Promise<Customer> {
        return await this.customerService.createCustomer(payload);
    }

    public async addProduct(payload: CreateProductPayload): Promise<Product> {
        return await this.productService.createProduct(payload);
    }

    public async updateProductDetails(payload: UpdateProductPayload): Promise<Product | null> {
        await this.productService.updateProduct(payload);
        return await this.productService.getProductById(payload);
    }

    public async restockProductInventory(payload: UpdateProductRestockPayload): Promise<ProductRestockResponse> {
        return await this.productService.productRestock(payload);
    };


    public async addProductToCart(payload: CreateOrAddCartPayload): Promise<Cart> {
        return await this.cartService.addToCart(payload);
    }

    public async getCartByCustomerId(customerId: number): Promise<Cart | null> {
        return await this.cartService.getCartByCustomerId(customerId);
    }

    public async placeOrder(payload: CreateOrderPayload): Promise<Order> {
        return await this.orderService.createOrder(payload);
    };

    public async completeOrder(order: Order): Promise<CompleteOrderResponse> {
        return await this.orderService.completeOrder(order);
    }

    public async checkoutCustomerCart(customerId: number): Promise<CompleteOrderResponse> {
        const customer = await this.getEntityById(EntityType.CUSTOMER, { id: customerId, relations: ['cart', 'cart.items', 'cart.items.product'] },);
        if (!customer) {
            throw new Error(`Customer ID: ${customerId} not found!`)
        }
        const cart = await this.getCartByCustomerId(customerId); // returns only cart but in this case I have it fromthe fetched customer 
        if (!cart) {
            throw new Error(`Customer ID:${customerId} doesn't have cart yet!`)
        }
        const order = await this.placeOrder({ customer })
        return await this.completeOrder(order);
    }






}


