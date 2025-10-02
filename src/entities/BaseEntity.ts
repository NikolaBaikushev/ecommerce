
export abstract class BaseEntityClass {
    toPrint() {
        return `${this.constructor.name} ${JSON.stringify(this, null, 2)}`
    }
}