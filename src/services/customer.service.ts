import { Notify } from "../common/decorators/notify";
import { SuccessEventName, ErrorEventName } from "../common/events/notify-events";
import { CreateCustomerPayload } from "../common/types/customer/request/create-customer-payload";
import { GetPayload } from "../common/types/domain/get";
import { Customer } from "../entities/Customer";
import { DatabaseManager } from "./database.service";


export class CustomerService {
    static #instance: CustomerService;


    private constructor(private readonly database: DatabaseManager) { }

    public static getInstance(): CustomerService {
        if (!this.#instance) {
            const database = DatabaseManager.getInstance();
            this.#instance = new CustomerService(database);
        }
        return this.#instance;
    }

    getCustomerById(payload: GetPayload): Promise<Customer | null> {
        const repository = DatabaseManager.getRepository(Customer);
        return repository.findOne({
            where: { id: payload.id },
            relations: [...(payload?.relations ?? [])]
        })
    }

    @Notify(SuccessEventName.CUSTOMER_CREATED, ErrorEventName.ERROR_CUSTOMER_CREATED)
    createCustomer(payload: CreateCustomerPayload) {
        const repository = DatabaseManager.getRepository(Customer)
        const customer: Customer = repository.create(payload);

        return repository.save(customer);
    }
}

