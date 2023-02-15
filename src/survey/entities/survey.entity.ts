/* eslint-disable prettier/prettier */
import { ObjectType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
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

  @CreateDateColumn()
  readonly createdAt: Date;

  @CreateDateColumn()
  readonly modifiedAt: Date;

  @OneToMany((type) => Question, (question) => question.survey)
  questions: Question[];

  @OneToMany((type) => Response, (response) => response.survey)
  responses: Response[];
}
