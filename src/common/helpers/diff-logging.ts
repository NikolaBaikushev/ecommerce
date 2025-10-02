
import { diffJson } from 'diff';
import chalk from 'chalk';

export function printDiff(before: any, after: any) {
    const differences = diffJson(before, after);
    for (const part of differences) {
        const color = part.added ? chalk.green :
            part.removed ? chalk.red :
                chalk.gray;
        process.stdout.write(color(part.value));
    }
    console.log(); // Newline
}