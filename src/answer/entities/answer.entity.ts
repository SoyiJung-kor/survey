import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Question } from '../../question/entities/question.entity';
import { ResponseAnswer } from '../../ResponseAnswer/entities/ResponseAnswer.entity';

@Entity()
@ObjectType()
export class Answer {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

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
  @JoinColumn({ name: 'questionId' })
  question: Question;

  @OneToMany(() => ResponseAnswer, (ResponseAnswer) => ResponseAnswer.answer)
  ResponseAnswer: ResponseAnswer[];
}
