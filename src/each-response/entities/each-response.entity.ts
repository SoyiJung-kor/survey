import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Response } from '../../response/entities/response.entity';

@ObjectType()
@Entity()
export class EachResponse {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column()
  responseId: number;

  @Field(() => String)
  @Column()
  responseQuestion: string;

  @Field(() => String)
  @Column()
  responseAnswer: string;

  @Field(() => Int)
  @Column()
  responseScore: number;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;

  @DeleteDateColumn()
  readonly deletedAt: Date;

  @ManyToOne(() => Response, (response) => response.eachResponse, {
    nullable: false,
  })
  response: Response;
}
