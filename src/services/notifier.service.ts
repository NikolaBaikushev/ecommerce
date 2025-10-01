import { NotifyEvent } from "../common/events/notify-events";

type SubscriberFunction = (...params: any[]) => any

export class Notifier{
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