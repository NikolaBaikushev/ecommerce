import { Entity, PrimaryGeneratedColumn, Column, Collection } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false})
    name: string;

    @Column('decimal', { nullable: false, default: 0})
    price: number;

    @Column({nullable: true})
    description: string

    // @Column()
    // stock: number
    
}