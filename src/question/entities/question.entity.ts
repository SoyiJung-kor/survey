import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IsNumber, MinLength } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Answer } from '../../answer/entities/answer.entity';
import { CommonEntity } from '../../common/entities/\bcommon.entity';
import { QuestionCategory } from '../../question-category/entities/question-category.entity';
import { Survey } from '../../survey/entities/survey.entity';

@ObjectType()
@Entity()
export class Question extends CommonEntity {
  @Field(() => Int)
  @Column()
  @IsNumber()
  questionNumber: number;

  @Field(() => String)
  @Column()
  @MinLength(5)
  questionContent: string;

  @Column()
  surveyId: number;

  @ManyToOne(() => Survey, (survey) => survey.questions, {
    onDelete: 'CASCADE',
  })
  @Field(() => Survey)
  @JoinColumn({ name: 'surveyId' })
  survey: Survey;

  @OneToMany(() => Answer, (answers) => answers.question, { cascade: true })
  @Field(() => [Answer], { nullable: true })
  answers: Answer[];

  @OneToMany(
    () => QuestionCategory,
    (questionCategory) => questionCategory.question,
    { cascade: true },
  )
  @Field(() => [QuestionCategory], { nullable: true })
  questionCategories: QuestionCategory[];
}
