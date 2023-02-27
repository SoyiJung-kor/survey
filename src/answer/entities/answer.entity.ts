import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IsNumber, IsString, MinLength } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Question } from '../../question/entities/question.entity';

@Entity()
@ObjectType()
export class Answer {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;

  @DeleteDateColumn()
  readonly deletedAt: Date;

  @Field(() => Int)
  @Column()
  @IsNumber()
  answerNumber: number;

  @Field(() => String)
  @Column()
  @IsString()
  @MinLength(2)
  answerContent: string;

  @Field(() => Int)
  @Column()
  @IsNumber()
  answerScore: number;

  @ManyToOne(() => Question, (question) => question.answers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'questionId' })
  @Field(() => Question)
  question: Question;

  @Column()
  questionId: number;
}
