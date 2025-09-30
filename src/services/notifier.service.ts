

type SubscriberFunction = (...params: any[]) => any

export enum SuccessEventName {
    PRODUCT_CREATED = 'product.created',
    DATABASE_INITIALIZED = 'db.init',
}

export enum ErrorEventName {
    ERROR_PRODUCT_CREATED = 'error.product.created',
    ERROR_DATABASE_INITIALIZED = 'error.db.init',
}

type EventToErrorMap = {
    [SuccessEventName.PRODUCT_CREATED]: ErrorEventName.ERROR_PRODUCT_CREATED;
    [SuccessEventName.DATABASE_INITIALIZED]: ErrorEventName.ERROR_DATABASE_INITIALIZED;
};

type NotifyEvent = SuccessEventName | ErrorEventName



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

const eventHandlers: Array<{
  eventName: NotifyEvent;
  target: any;
  methodName: string;
}> = [];

export function OnEvent(eventName: NotifyEvent) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        eventHandlers.push({
            eventName,
            target,
            methodName: propertyKey,
        });
    };
}

export function registerEventHandlers() {
    const notifier = Notifier.getInstance();

    for (const { eventName, target, methodName } of eventHandlers) {
        const handler = target[methodName].bind(target);

        notifier.subscribe(eventName, handler);
    }
}


export function Use(value: unknown) {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = function(...args: any[]) {
            if (typeof value === 'function') {
                value.call(this, ...args)
            }
            originalMethod.apply(this, args);
        }

        return descriptor
    }
}

export class Notifier {
    static #instance: Notifier;

    private eventMap = new Map<NotifyEvent, Set<SubscriberFunction>>();

    private constructor() { }

    public static getInstance() {
        if (!this.#instance) {
            this.#instance = new Notifier();
        }

        return this.#instance;
    }

    public subscribe(eventName: NotifyEvent, subscriberFn: SubscriberFunction) {
        const subscribers = this.eventMap.get(eventName) || new Set();
        subscribers.add(subscriberFn);
        this.eventMap.set(eventName, subscribers);
    }

    public unsubscribe(eventName: NotifyEvent, subscriberFn: SubscriberFunction) {
        const subscribers = this.eventMap.get(eventName);
        if (!subscribers) return;
        subscribers.delete(subscriberFn);
    }

    public notify(eventName: NotifyEvent, ...params: any[]) {
        const subcribers = this.eventMap.get(eventName) || new Set();

        for (const sub of subcribers) {
            try {
                sub(...params);
            } catch (error) {
                console.error(`Notifier subscriber for event ${eventName} threw an error:`, error);
            }
        }
    }

}