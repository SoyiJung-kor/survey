/* eslint-disable prettier/prettier */
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Question } from '../../question/entities/question.entity';
import { PickedSurvey } from './pickedSurvey.entity';

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

  @OneToMany(() => Question, (question) => question.survey, { cascade : true })
  questions: Question[];

  @OneToMany(() => PickedSurvey, (pickedSurvey) => pickedSurvey.survey)
  pickedSurvey: PickedSurvey[];
}
