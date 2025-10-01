
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