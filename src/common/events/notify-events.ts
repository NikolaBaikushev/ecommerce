
export enum SuccessEventName {
    PRODUCT_CREATED = 'product.created',
    DATABASE_INITIALIZED = 'db.init',
    CUSTOMER_CREATED = 'customer.created',
    CART_CREATED = 'cart.created',
    ORDER_CREATED = 'order.created',
    PRODUCT_UPDATED = 'product.updated',
    PRODUCT_RESTOCK = 'product.restock',
    ORDER_COMPLETED = 'order.completed',
    CUSTOMER_BALANCE_CHANGED = 'customer.balance.changed',
}

export enum ErrorEventName {
    ERROR_PRODUCT_CREATED = 'error.product.created',
    ERROR_DATABASE_INITIALIZED = 'error.db.init',
    ERROR_CUSTOMER_CREATED = 'error.customer.created',
    ERROR_CART_CREATED = 'error.cart.created',
    ERROR_ORDER_CREATED = 'error.order.created',
    ERROR_PRODUCT_UPDATED = 'error.product.updated',
    ERROR_PRODUCT_RESTOCK = 'error.product.restock',
    ERROR_ORDER_COMPLETED = 'error.order.completed',
    ERROR_CUSTOMER_BALANCE_CHANGED = 'error.customer.balance.changed',
}

export type EventToErrorMap = {
    [SuccessEventName.PRODUCT_CREATED]: ErrorEventName.ERROR_PRODUCT_CREATED;
    [SuccessEventName.DATABASE_INITIALIZED]: ErrorEventName.ERROR_DATABASE_INITIALIZED;
    [SuccessEventName.CUSTOMER_CREATED]: ErrorEventName.ERROR_CUSTOMER_CREATED;
    [SuccessEventName.CART_CREATED]: ErrorEventName.ERROR_CART_CREATED;
    [SuccessEventName.ORDER_CREATED]: ErrorEventName.ERROR_ORDER_CREATED;
    [SuccessEventName.PRODUCT_UPDATED]: ErrorEventName.ERROR_PRODUCT_UPDATED;
    [SuccessEventName.PRODUCT_RESTOCK]: ErrorEventName.ERROR_PRODUCT_RESTOCK;
    [SuccessEventName.ORDER_COMPLETED]: ErrorEventName.ERROR_ORDER_COMPLETED;
    [SuccessEventName.CUSTOMER_BALANCE_CHANGED]: ErrorEventName.ERROR_CUSTOMER_BALANCE_CHANGED;
};

export type NotifyEvent = SuccessEventName | ErrorEventName