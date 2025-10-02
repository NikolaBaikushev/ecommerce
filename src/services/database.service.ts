import { ObjectLiteral, Repository } from "typeorm";
import { AppDataSource } from "../datasource";
import { Notify } from "../common/decorators/notify";
import { SuccessEventName, ErrorEventName } from "../common/events/notify-events";
import { OnEvent } from "../common/decorators/on-event";
import { Logger } from "./logger.service";



export class DatabaseManager {
    static #instance: DatabaseManager;
    private logger: Logger = Logger.getInstance();

    private constructor() { }

    @Notify(SuccessEventName.DATABASE_INITIALIZED, ErrorEventName.ERROR_DATABASE_INITIALIZED)
    public async initialize(): Promise<void> {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
    }

    public static getInstance() {
        if (!this.#instance) {
            this.#instance = new DatabaseManager();
        }
        return this.#instance;
    }

    public static getRepository<T extends ObjectLiteral>(entity: { new(): T }): Repository<T> {
        return AppDataSource.getRepository(entity);
    }


    @OnEvent(SuccessEventName.DATABASE_INITIALIZED)
    handlDatabaseInitialize() {
        this.logger.bgSuccess('===== Database successfully connected =====')
    }

    @OnEvent(ErrorEventName.ERROR_DATABASE_INITIALIZED)
    handleDatabaseInitializeError(error: unknown) {
        this.logger.bgFail(`=== Database connection FAILED ===, ${error}`)
    }


}

