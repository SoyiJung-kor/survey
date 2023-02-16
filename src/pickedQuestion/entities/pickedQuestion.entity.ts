import { Field, Int } from '@nestjs/graphql';
import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Response } from '../../response/entities/response.entity';
import { Question } from '../../question/entities/question.entity';

export class PickedQuestion {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  pickedQuestionId: number;

  @Field(() => String)
  @Column()
  pickedQuestionContent: string;

  @Field(() => Int)
  pickedQuestionNumber: number;

  @Field(() => Int)
  @Column()
  questionId: number;

  @ManyToOne(() => Question, (question) => question.pickedQuestion)
  question: Question;

  @Field(() => Int)
  @Column()
  responseId: number;

  @ManyToOne(() => Response, (response) => response.pickedQuestions)
  response: Response;
}
