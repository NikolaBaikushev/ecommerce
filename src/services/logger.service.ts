import chalk from 'chalk';
import { WrapWithConsoleLog } from '../common/decorators/wrap-with-console-log';

export class Logger {
    static #instance: Logger;

    private constructor() { }

    public static getInstance() {
        if (!this.#instance) {
            this.#instance = new Logger();
        }
        return this.#instance
    }

    @WrapWithConsoleLog
    bold(message:string, hexColor: string = '#0dbd4b') {
        return chalk.bold.hex(hexColor)(message)
    }

    @WrapWithConsoleLog
    success(message: string) {
        return chalk.green(message)
    }

    @WrapWithConsoleLog
    bgSuccess(message: string) {
        return chalk.bgGreenBright(message)
    }

    @WrapWithConsoleLog
    yellow(message: string) {
        return chalk.yellow(message)
    }

    @WrapWithConsoleLog
    fail(message: string) {
        return chalk.red(message)
    }
    @WrapWithConsoleLog
    bgFail(message: string) {
        return chalk.bgRed(message)
    }

    @WrapWithConsoleLog
    bgYellow(message: string) {
        return chalk.bgYellow(message)
    }

    @WrapWithConsoleLog
    neutral(message: string) {
        return chalk.cyan(message)
    }

}