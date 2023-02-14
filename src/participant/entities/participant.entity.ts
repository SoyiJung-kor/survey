import { ObjectType, Field, Int, GraphQLTimestamp } from '@nestjs/graphql';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
export class Participant {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  participantId: number;

  @Field(() => String)
  @Column()
  email: string;

  @Field(() => GraphQLTimestamp)
  @Column()
  createdAt: Date;

  @Field(() => GraphQLTimestamp)
  @Column()
  modifiedAt: Date;

}
