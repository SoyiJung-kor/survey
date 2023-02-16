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
import { Answer } from '../../answer/entities/answer.entity';
import { Survey } from '../../survey/entities/survey.entity';
import { PickedQuestion } from '../../pickedQuestion/entities/pickedQuestion.entity';

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

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;

  @Field(() => Int)
  @Column()
  surveyId: number;

  @ManyToOne(() => Survey, (survey) => survey.questions, { nullable: false })
  survey: Survey;

  @OneToMany(() => Answer, (answers) => answers.question, { cascade: true })
  @JoinTable()
  answers: Answer[];

  @OneToMany(() => PickedQuestion, (pickedQuestion) => pickedQuestion.question)
  @JoinTable()
  pickedQuestion: PickedQuestion[];
}
