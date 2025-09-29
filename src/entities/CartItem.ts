import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { EntityType } from "../services/store";
import { Cart } from "./Cart";
import { Product } from "./Product";

@Entity()
export class CartItem {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    quantity: number

    @ManyToOne(() => Cart, cart => cart.items, { onDelete: 'CASCADE' })
    cart: Cart

    @ManyToOne(() => Product)
    product: Product
}