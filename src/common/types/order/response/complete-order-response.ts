import { Order } from "../../../../entities/Order";

export type CompleteOrderResponse = {
    beforeCompleteOrder: Order,
    afterCompleteOrder: Order,
}

