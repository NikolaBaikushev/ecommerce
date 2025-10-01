import { Notifier } from "../../services/notifier.service";
import { NotifyEvent } from "../events/notify-events";



const EVENT_HANDLERS: Array<{
  eventName: NotifyEvent;
  target: any;
  methodName: string;
}> = [];

export function OnEvent(eventName: NotifyEvent) {
    return function (target: any, propertyKey: string, _descriptor: PropertyDescriptor) {
        void _descriptor;
        
        EVENT_HANDLERS.push({
            eventName,
            target,
            methodName: propertyKey,
        });
    };
}

export function RegisterEventHandlers() {
    const notifier = Notifier.getInstance();

    for (const { eventName, target, methodName } of EVENT_HANDLERS) {
        // NOTE: Target is the prototype so it doesn't have instance properties.
        const handler = target[methodName].bind(target);

        notifier.subscribe(eventName, handler);
    }
}
