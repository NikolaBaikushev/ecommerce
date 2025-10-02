import { UpdateResult } from "typeorm";
import { SuccessEventName } from "../common/events/notify-events";
import { UpdateCustomerPayload } from "../common/types/customer/request/update-customer.payload";
import { Customer } from "../entities/Customer";
import { Order } from "../entities/Order";
import { CustomerService } from "./customer.service";
import { Operations } from "./event-handler.service";
import { Logger } from "./logger.service";
import { Notifier } from "./notifier.service";
import { CustomerBalanceChangeResponse } from "../common/types/customer/response/customer-balance-changed";

export class PaymentService {
    static #instance: PaymentService
    private logger: Logger = Logger.getInstance();
    private notifier: Notifier = Notifier.getInstance();

    private constructor(private readonly customerService: CustomerService) { }

    static getInstance(): PaymentService {
        if (!this.#instance) {
            this.#instance = new PaymentService(CustomerService.getInstance());
        }
        return this.#instance;
    }


    public processOrderPayment(customer: Customer, order: Order): Promise<void> {
        this.logger.neutral(`=== OPERATION: ${Operations.PAY} STARTED ===`)

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (customer.balance >= order.total) {
                    const beforeCustomer = Object.assign({}, customer);
                    const payload: UpdateCustomerPayload = Object.assign({ ...customer }, { balance: Math.abs(customer.balance - order.total).toFixed(2) });

                    this.customerService.updateCustomer(payload)
                        .then((result: UpdateResult) => {
                            return this.customerService.getCustomerById({ id: payload.id });
                        })
                        .then((updatedCustomer) => {
                            if (updatedCustomer) {
                                const response: CustomerBalanceChangeResponse = {
                                    beforeCustomerBalanceChange: beforeCustomer,
                                    afterCustomerBalanceChange: updatedCustomer,
                                }
                                this.notifier.notify(SuccessEventName.CUSTOMER_BALANCE_CHANGED, response)
                                resolve()
                            }
                        })
                        .catch(err => reject(err))
                } else {
                    reject(new Error(`Customer ${customer.id}:${customer.name} is broke! Get some more money!`))
                }
            }, 1000);
        })
    }
}
