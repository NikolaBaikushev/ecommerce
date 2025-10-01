import { Order } from "../../../../entities/Order";

export type UpdateOrderPayload = Partial<Order> & { id: number };
