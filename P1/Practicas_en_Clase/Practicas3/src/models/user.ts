import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import {View} from "./view";

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    email!: string;

    @OneToMany(() => View, (view:View) => view.user)
    views!: View[];
}