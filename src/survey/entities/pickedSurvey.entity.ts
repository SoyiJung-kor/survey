import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Response } from '../../response/entities/response.entity';
import { Survey } from './survey.entity';

@ObjectType()
@Entity()
export class PickedSurvey {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  pickedSurveyId: number;

  @Field(() => String)
  @Column()
  pickedSurveyTitle: string;

  @Field(() => Int)
  @Column()
  surveyId: number;

  @ManyToOne(() => Survey, (survey) => survey.pickedSurvey)
  survey: Survey;

  @Field(() => Int)
  @Column()
  responseId: number;

  @ManyToOne(() => Response, (response) => response.pickedSurvey)
  response: Response;
}
