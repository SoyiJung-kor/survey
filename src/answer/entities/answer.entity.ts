import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Question } from '../../question/entities/question.entity';
import { PickedAnswer } from './pickedAnswer.entity';

@Entity()
@ObjectType()
export class Answer {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  answerId: number;

  @Field(() => Int)
  @Column()
  answerNumber: number;

  @Field(() => String)
  @Column()
  answerContent: string;

  @Field(() => Int)
  @Column()
  answerScore: number;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly modifiedAt: Date;

  @ManyToOne(() => Question, (question) => question.answers, {
    nullable: false,
  })
  question: Question;

  @OneToMany(() => PickedAnswer, (pickedAnswer) => pickedAnswer.answer)
  @JoinTable()
  pickedAnswer: PickedAnswer[];

  @Field(() => Int)
  @Column()
  questionId: number;
}
