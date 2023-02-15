/* eslint-disable prettier/prettier */
import { ObjectType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
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

  @UpdateDateColumn()
  readonly modifiedAt: Date;

  @OneToMany((type) => Question, (question) => question.survey, { cascade : true })
  @JoinTable()
  questions: Question[];

  @OneToMany((type) => Response, (response) => response.survey)
  responses: Response[];
}
