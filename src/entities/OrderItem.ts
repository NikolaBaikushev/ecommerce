import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./Order";
import { Product } from "./Product";
import { BaseEntityClass } from "./BaseEntity";

@Entity()
export class OrderItem extends BaseEntityClass {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    quantity: number;

    @ManyToOne(() => Order, order => order.items, { onDelete: "CASCADE" })
    order: Order;

    @ManyToOne(() => Product)
    product: Product;

}