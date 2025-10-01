import { EntityMap, UpdatePayloadOf } from "./core";

export type UpdatePayloadMap = {
    [K in keyof EntityMap]: UpdatePayloadOf<K>;
};