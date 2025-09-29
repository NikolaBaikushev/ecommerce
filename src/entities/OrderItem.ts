import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./Order";
import { Product } from "./Product";

@Entity()
export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    quantity: number;

    @ManyToOne(() => Order, order => order.items, { onDelete: "CASCADE"})
    order: Order;
    
    @ManyToOne(() => Product)
    product: Product;
}