import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Customer } from "./Customer";
import { OrderItem } from "./OrderItem";
import { BaseEntityClass } from "./BaseEntity";

export enum OrderStatus {
    CREATED = 'created',
    COMPLETED = 'completed'
}

type PrintableOrder<T extends Order> = {
    [K in keyof T]: K extends 'items' ? Omit<OrderItem, 'order'>[] : T[K]
}


@Entity()
export class Order extends BaseEntityClass {
    @PrimaryGeneratedColumn()
    id: number

    @Column('decimal')
    total: number

    @Column({ enum: OrderStatus, default: OrderStatus.CREATED })
    status: OrderStatus

    @ManyToOne(() => Customer, customer => customer.orders)
    customer: Customer

    @OneToMany(() => OrderItem, item => item.order, { cascade: true })
    items: OrderItem[]

    *[Symbol.iterator](): Generator<Omit<OrderItem, 'order' | 'toPrint'>> {
        for (const item of this.items) {
            yield {
                id: item.id,
                quantity: item.quantity,
                product: item.product,
            }
        }
    }

    override toPrint() {
        const safeItems: Omit<OrderItem, 'order' | 'toPrint'>[] = this.items.map(({ order, ...rest }) => rest);
        const printable: PrintableOrder<Order> = Object.assign({}, { ...this, items: safeItems });
        return `${this.constructor.name} ${JSON.stringify(printable, null, 2)}`;
    }

}