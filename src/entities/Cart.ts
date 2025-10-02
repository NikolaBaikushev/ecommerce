import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Customer } from "./Customer";
import { CartItem } from "./CartItem";
import { BaseEntityClass } from "./BaseEntity";

type PrintableCart<T extends Cart> = {
    [K in keyof T]: K extends 'items' ? Omit<CartItem, 'cart'>[] : T[K]
}

@Entity()
export class Cart extends BaseEntityClass {
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

    *[Symbol.iterator](): Generator<Omit<CartItem, 'cart' | 'toPrint'>> {
        for (const item of this.items) {
            yield {
                id: item.id,
                product: item.product,
                quantity: item.quantity,
            }
        }
    }

    override toPrint() {
        const safeItems: Omit<CartItem, 'cart' | 'toPrint'>[] = this.items.map(({ cart, ...rest }) => rest);
        const printable: PrintableCart<Cart> = Object.assign({}, { ...this, items: safeItems });
        return `${this.constructor.name} ${JSON.stringify(printable, null, 2)}`;
    }
}

