import { ObjectType, Field, Int, GraphQLTimestamp } from '@nestjs/graphql';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Answer } from '../../answer/entities/answer.entity';
import { Survey } from '../../survey/entities/survey.entity';

@ObjectType()
@Entity()
export class Question {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  questionId: number;

  @Field(() => Int)
  @Column()
  questionNumber: number;

  @Field(() => String)
  @Column()
  questionContent: string;

  @Field(() => GraphQLTimestamp)
  @Column()
  createdAt: Date;

  @Field(() => GraphQLTimestamp)
  updatedAt: Date;

  @ManyToOne(() => Survey, (survey) => survey.questions)
  survey: Survey;

  @OneToMany(() => Answer, (answers) => answers.question)
  answers: Answer[];
}
