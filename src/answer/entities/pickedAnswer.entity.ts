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
import { Answer } from './answer.entity';

@Entity()
@ObjectType()
export class PickedAnswer {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  pickedAnswerId: number;

  @Field(() => Int)
  @Column()
  pickedAnswerNumber: number;

  @Field(() => String)
  @Column()
  pickedAnswerContent: string;

  @Field(() => Int)
  @Column()
  pickedAnswerScore: number;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly modifiedAt: Date;

  @ManyToOne(() => Answer, (answer) => answer.pickedAnswer)
  answer: Answer;

  @ManyToOne(() => Response, (response) => response.pickedAnswers)
  response: Response;

  @Field(() => Int)
  @Column()
  questionId: number;

  @Field(() => Int)
  @Column()
  responseId: number;
}
