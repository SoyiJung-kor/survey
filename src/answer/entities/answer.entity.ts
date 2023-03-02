import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IsNumber, IsString, MinLength } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from '../../common/entities/\bcommon.entity';
import { Question } from '../../question/entities/question.entity';

@Entity()
@ObjectType()
export class Answer extends CommonEntity {
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
