import { EntityTarget, ObjectLiteral, Repository } from "typeorm";
import { AppDataSource } from "../datasource";
import { EntityType } from "./store";



export class DatabaseManager {
    static #instance: DatabaseManager;

    private constructor() { }

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

}

