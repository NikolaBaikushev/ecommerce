import { Customer } from "../../../../entities/Customer";

export type CustomerBalanceChangeResponse = {
    beforeCustomerBalanceChange: Customer,
    afterCustomerBalanceChange: Customer
}