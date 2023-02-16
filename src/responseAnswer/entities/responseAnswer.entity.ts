import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Response } from '../../response/entities/response.entity';
import { Answer } from '../../answer/entities/answer.entity';

@Entity()
@ObjectType()
export class ResponseAnswer {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  ResponseAnswerId: number;

  @Field(() => Int)
  @Column()
  ResponseAnswerNumber: number;

  @Field(() => String)
  @Column()
  ResponseAnswerContent: string;

  @Field(() => Int)
  @Column()
  ResponseAnswerScore: number;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly modifiedAt: Date;

  @ManyToOne(() => Answer, (answer) => answer.ResponseAnswer)
  answer: Answer;

  @ManyToOne(() => Response, (response) => response.responseAnswers)
  response: Response;

  @Field(() => Int)
  @Column()
  questionId: number;

  @Field(() => Int)
  @Column()
  responseId: number;
}
