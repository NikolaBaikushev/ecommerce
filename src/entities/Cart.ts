import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
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

    @OneToOne(() => Customer, customer => customer.cart, { onDelete: 'CASCADE' })
    @JoinColumn()
    customer: Customer

    @OneToMany(() => CartItem, item => item.cart, { cascade: true })
    items: CartItem[]

    *[Symbol.iterator](): Generator<Omit<CartItem, 'cart'>> {
        for (const item of this.items) {
            yield {
                id: item.id,
                product: item.product,
                quantity: item.quantity,
            }
        }
    }
}