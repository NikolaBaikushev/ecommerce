import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./Order";
import { Cart } from "./Cart";
import { BaseEntityClass } from "./BaseEntity";

@Entity()
export class Customer extends BaseEntityClass {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string

    @Column({ type: 'boolean', default: false, nullable: false })
    isPremium: boolean

    @OneToMany(() => Order, order => order.customer)
    orders: Order[]

    @OneToOne(() => Cart, cart => cart.customer, { cascade: true })
    cart: Cart

    @Column({ type: 'decimal', default: 0 })
    balance: number
}