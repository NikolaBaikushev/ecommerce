import { Collection, PrimaryGeneratedColumn, Column, Entity, OneToOne, ManyToOne } from "typeorm";
import { EntityType } from "../services/store";
import { Customer } from "./Customer";

enum OrderStatus {

}

type OrderSummary = Pick<Order, 'status' | 'total' | 'customer'>

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number

    @Column('decimal')
    total: number

    @Column({enum: OrderStatus})
    status: OrderStatus

    @ManyToOne(() => Customer, customer => customer.orders)
    customer: Customer



}