import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "./Cart";
import { Product } from "./Product";
import { BaseEntityClass } from "./BaseEntity";

@Entity()
export class CartItem extends BaseEntityClass {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    quantity: number

    @ManyToOne(() => Cart, cart => cart.items, { onDelete: 'CASCADE' })
    cart: Cart

    @ManyToOne(() => Product)
    product: Product
}