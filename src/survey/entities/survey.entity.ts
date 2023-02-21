/* eslint-disable prettier/prettier */
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Question } from '../../question/entities/question.entity';
import { Response } from '../../response/entities/response.entity';

@ObjectType()
@Entity()
export class Survey {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column()
  surveyTitle: string;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;

  @DeleteDateColumn()
  readonly deletedAt: Date;

  @OneToMany(() => Question, (question) => question.survey, { cascade : true })
  questions: Question[];

  @OneToMany(() => Response, (response) => response.survey,  {cascade : true})
  response: Response[];
   // @OneToMany(() => ResponseSurvey, (responseSurvey) => responseSurvey.survey)
  // responseSurvey: ResponseSurvey[];

  
}
