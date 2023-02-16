import { Field, Int } from '@nestjs/graphql';
import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Response } from '../../response/entities/response.entity';
import { Question } from '../../question/entities/question.entity';

export class ResponseQuestion {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  ResponseQuestionId: number;

  @Field(() => String)
  @Column()
  ResponseQuestionContent: string;

  @Field(() => Int)
  ResponseQuestionNumber: number;

  @Field(() => Int)
  @Column()
  questionId: number;

  @ManyToOne(() => Question, (question) => question.ResponseQuestion)
  question: Question;

  @Field(() => Int)
  @Column()
  responseId: number;

  @ManyToOne(() => Response, (response) => response.responseQuestion)
  response: Response;
}
