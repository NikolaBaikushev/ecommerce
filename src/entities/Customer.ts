import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./Order";

@Entity()
export class Customer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string

    @Column()
    isPremium: boolean

    @OneToMany(() => Order, order => order.customer)
    orders: Order[]
    // Cart 


}