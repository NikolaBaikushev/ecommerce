import { NotifyEvent } from "../events/notify-events";

// NOTE: This functions help the RegisterEventHandler register the handle functions decorated from @OnEvent from different classes otherwise
// ex: If all @OnEvent are in the EventHandler it works fine, but if there are some OnEvent on App, EventHandler etc... we need to have a map with the Class => instance so the decorator gets the instance and binds to it ... 
export const EVENT_HANDLERS: Array<{
    eventName: NotifyEvent;
    target: any;
    methodName: string;
}> = [];

export const DECORATED_CLASSES = new Set<any>();


function getDecoratedClasses() {
    return [...DECORATED_CLASSES];
}


export function getInstance(targetClass: any): any {
    if (typeof targetClass.getInstance === 'function') {
        return targetClass.getInstance();
    }

    return new targetClass();
}

export function getInstanceCache() {
    const instanceCache = new Map<any, any>();

    const decoratedClasses = getDecoratedClasses();
    for (const Class of decoratedClasses) {
        if (!instanceCache.has(Class)) {
            instanceCache.set(Class, getInstance(Class));
        }
    }

    return instanceCache
}
