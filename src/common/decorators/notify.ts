import { Notifier } from "../../services/notifier.service";
import { SuccessEventName, ErrorEventName, EventToErrorMap } from "../events/notify-events";




export function Notify<
    T extends SuccessEventName,
    E extends ErrorEventName = EventToErrorMap[T]
    >(eventName: T, errorEventName?: E) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            try {
                const result = await originalMethod.apply(this, args);
                Notifier.getInstance().notify(eventName, result);
                return result;
            } catch (error) {
                if (errorEventName) {
                    Notifier.getInstance().notify(errorEventName, error);
                }
                throw error;
            }
        };

        return descriptor;
    };
}