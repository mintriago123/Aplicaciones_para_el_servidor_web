import {Column,Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user";

@Entity()
export class View{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    vista!: string;

    @ManyToOne(() => User, (User:User) => User.views)
    user!: User;

}