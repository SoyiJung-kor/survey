import { ObjectType, Field, Int, GraphQLTimestamp } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Answer {

  @Field(() => Int)
  @PrimaryGeneratedColumn()
  answerId: number;

  @Field(() => Int)
  @Column()
  answerNumber: number;

  @Field(() => String)
  @Column()
  answerContent: string;

  @Field(() => Int)
  @Column()
  answerScore: number;

  @Field(() => GraphQLTimestamp)
  @Column()
  createdAt: Date;

  @Field(() => GraphQLTimestamp)
  @Column()
  modifiedAt:Date;

}
