import { ObjectType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Survey {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  surveyId: number;

  @Field(() => String)
  @Column()
  surveyTitle: string;

  @Field(() => GraphQLISODateTime)
  @Column()
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  @Column()
  modifiedAt: Date;
}
