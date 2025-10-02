import { Customer } from "../entities/Customer";
import { Order } from "../entities/Order";
import { CustomerService } from "./customer.service";
import { Logger } from "./logger.service";

export class PaymentService {
    static #instance: PaymentService
    private logger: Logger = Logger.getInstance();
    private constructor(private readonly customerService: CustomerService) { }

    static getInstance(): PaymentService {
        if (!this.#instance) {
            this.#instance = new PaymentService(CustomerService.getInstance());
        }
        return this.#instance;
    }


    public processOrderPayment(customer: Customer, order: Order): Promise<void> {
        this.logger.neutral('=== OPERATION: Payment started ... ===')

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (customer.balance >= order.total) {
                    customer.balance -= order.total
                    this.customerService.updateCustomer(customer)
                        .then(() => resolve())
                        .catch(err => reject(err))
                } else {
                    reject(new Error(`Customer ${customer.id}:${customer.name} is broke! Get some more money!`))
                }
            }, 5000);
        })
    }
}
