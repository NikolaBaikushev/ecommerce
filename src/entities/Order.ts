import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Customer } from "./Customer";
import { OrderItem } from "./OrderItem";

export enum OrderStatus {
    CREATED = 'created',
    COMPLETED = 'completed'
}

// type OrderSummary = Pick<Order, 'status' | 'total' | 'customer'>

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number

    @Column('decimal')
    total: number

    @Column({enum: OrderStatus, default: OrderStatus.CREATED})
    status: OrderStatus

    @ManyToOne(() => Customer, customer => customer.orders)
    customer: Customer

    @OneToMany(() => OrderItem, item => item.order, {cascade: true})
    items: OrderItem[]

    *[Symbol.iterator](): Generator<Omit<OrderItem, 'order'>> {
        for (const item of this.items) {
            yield {
                id: item.id,
                quantity: item.quantity,
                product: item.product,
            }
        }
    }

}