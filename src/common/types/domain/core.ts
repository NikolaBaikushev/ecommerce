import { Customer } from "../../../entities/Customer";
import { Order } from "../../../entities/Order";
import { Product } from "../../../entities/Product";
import { CreateCustomerPayload } from "../../../services/customer.service";
import { CreateOrderPayload } from "../order/request/create-order-payload";
import { CreateProductPayload } from "../product/request/create-product-payload";
import { UpdateProductPayload } from "../product/request/update-product-payload";

export enum EntityType {
    PRODUCT,
    CUSTOMER,
    ORDER,
}

export type EntityMap = {
    [EntityType.PRODUCT]: Product,
    [EntityType.CUSTOMER]: Customer,
    [EntityType.ORDER]: Order,
}


export type CreatePayloadOf<T> =
    T extends typeof EntityType.PRODUCT ? CreateProductPayload :
    T extends typeof EntityType.CUSTOMER ? CreateCustomerPayload :
    T extends typeof EntityType.ORDER ? CreateOrderPayload :
    never;

export type UpdatePayloadOf<T> =
    T extends typeof EntityType.PRODUCT ? UpdateProductPayload :
    never;
