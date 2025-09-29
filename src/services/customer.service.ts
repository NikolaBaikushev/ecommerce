import { DatabaseManager } from "./database.service";

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

    createCustomer() {
        // implementation here
    }
}

