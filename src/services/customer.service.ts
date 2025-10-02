import { Notify } from "../common/decorators/notify";
import { OnEvent } from "../common/decorators/on-event";
import { SuccessEventName, ErrorEventName } from "../common/events/notify-events";
import { CreateCustomerPayload } from "../common/types/customer/request/create-customer-payload";
import { UpdateCustomerPayload } from "../common/types/customer/request/update-customer.payload";
import { GetPayload } from "../common/types/domain/get";
import { Customer } from "../entities/Customer";
import { DatabaseManager } from "./database.service";
import { Operations } from "./event-handler.service";
import { Logger } from "./logger.service";

export class CustomerService {
    static #instance: CustomerService;
    private logger: Logger = Logger.getInstance();

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

    async updateCustomer(payload: UpdateCustomerPayload) {
        return await DatabaseManager.getRepository(Customer).update({id: payload.id}, payload);
    }

    @OnEvent(SuccessEventName.CUSTOMER_CREATED)
    handleCustomerCreated(customer: Customer) {
        this.logger.neutral(`=== OPERATION: ${Operations.CREATE_CUSTOMER} FINISHED ===`)
        this.logger.bgSuccess(`=== RESULT: Customer created with ID: ${customer.id} ===`)
    }

    @OnEvent(ErrorEventName.ERROR_CUSTOMER_CREATED)
    handleCustomerCreatedError(error: Error) {
        this.logger.fail(`=== OPERATION: ${Operations.CREATE_CUSTOMER} FAILED ===, ${error}`)
    }
}

