import { Customer } from "../../../../entities/Customer";

export type UpdateCustomerPayload = Partial<Customer> & {id: number};
