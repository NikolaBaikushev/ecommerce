import { Collection, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { EntityType } from "../services/store";
import { Customer } from "./Customer";
import { CartItem } from "./CartItem";

@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    totalQuantity: number

    @Column('decimal')
    totalPrice: number

    @OneToOne(() => Customer, customer => customer.cart, {onDelete: 'CASCADE'} )
    @JoinColumn()
    customer: Customer

    @OneToMany(() => CartItem, item => item.cart, {cascade: true})
    items: CartItem[]
}