import { NotifyEvent } from "../events/notify-events";
import { DECORATED_CLASSES, EVENT_HANDLERS } from "../helpers/register-event-handler-helpers";



export function OnEvent(eventName: NotifyEvent) {
    return function (target: any, propertyKey: string, _descriptor: PropertyDescriptor) {
        void _descriptor;

        EVENT_HANDLERS.push({
            eventName,
            target,
            methodName: propertyKey,
        });

        DECORATED_CLASSES.add(target.constructor)
    };

}