import { Customer } from "../entities/Customer";
import { Order } from "../entities/Order";
import { DatabaseManager } from "./database.service";

export type CreateCustomerPayload = {
    name: string,
    isPremium?: boolean,
}

export class CustomerService {
    private static instance: CustomerService;


    private constructor(private readonly database: DatabaseManager) { }

    public static getInstance(): CustomerService {
        if (!this.instance) {
            const database = DatabaseManager.getInstance();
            this.instance = new CustomerService(database);
        }
        return this.instance;
    }

    createCustomer(payload: CreateCustomerPayload) {
        const repository = DatabaseManager.getRepository(Customer)
        const customer: Customer = repository.create(payload);

        return repository.save(customer);
    }
}

