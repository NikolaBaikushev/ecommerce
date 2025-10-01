import { Notifier } from "../../services/notifier.service";
import { EVENT_HANDLERS, getInstanceCache } from "../helpers/register-event-handler-helpers";


export function RegisterEventHandlers() {
    const notifier = Notifier.getInstance();

    const instances = getInstanceCache();

    for (const { eventName, target, methodName } of EVENT_HANDLERS) {
        const Class = target.constructor;

        const instance = instances.get(Class);
        if (!instance) {
            console.warn(`[WARN] Could not resolve instance for ${Class.name}`);
            continue;
        }

        const handler = instance[methodName].bind(instance);
        notifier.subscribe(eventName, handler);
    }
}
