import { EntityMap, CreatePayloadOf } from "./core";

export type CreatePayloadMap = {
    [K in keyof EntityMap]: CreatePayloadOf<K>;
};