import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./Order";
import { Cart } from "./Cart";

@Entity()
export class Customer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string

    @Column({ type: 'boolean', default: false, nullable: false})
    isPremium: boolean

    @OneToMany(() => Order, order => order.customer)
    orders: Order[]

    @OneToOne(() => Cart, cart => cart.customer,{cascade: true})
    cart: Cart


}