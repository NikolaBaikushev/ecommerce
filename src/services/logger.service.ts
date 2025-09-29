import chalk from 'chalk';

function WrapWithConsoleLog(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    const result = originalMethod.apply(this, args);
    console.log(result);
    return result;
  };

  return descriptor;
}

export class Logger {
    static #instance: Logger;

    private constructor() {}

    public static getInstance() {
        if (!this.#instance) {
            this.#instance = new Logger();
        }
        return this.#instance
    }

    @WrapWithConsoleLog
    green(message: string) {
        return chalk.green(message)
    }

    @WrapWithConsoleLog
    yellow(message:string) {
        return chalk.yellow(message)
    }

    @WrapWithConsoleLog
    red(message: string) {
        return chalk.red(message)
    }

    @WrapWithConsoleLog
    bgYellow(message: string) {
        return chalk.bgYellow(message)
    }

}