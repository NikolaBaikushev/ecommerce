import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { BaseEntityClass } from "./BaseEntity";

@Entity()
export class Product extends BaseEntityClass {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    name: string;

    @Column('decimal', { nullable: false, default: 0 })
    price: number;

    @Column({ nullable: true })
    description: string

    @Column({ default: 0 })
    stock: number
}