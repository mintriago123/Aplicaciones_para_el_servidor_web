import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class DatoAExportar {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  producto: string;

  @Field(() => Int)
  @Column()
  cantidad: number;

  @Field()
  @Column()
  destino: string;

  @Field()
  @Column()
  fechaExportacion: string;
}
