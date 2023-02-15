import { ObjectType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from '../../question/entities/question.entity';
import { Response } from '../../response/entities/response.entity';

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
  readonly createdAt: Date;

  @Field(() => GraphQLISODateTime)
  @Column()
  readonly modifiedAt: Date;

  @OneToMany((type) => Question, (question) => question.survey)
  questions: Question[];

  @OneToMany((type) => Response, (response) => response.survey)
  responses: Response[];
}
