import { ObjectType, Field } from '@nestjs/graphql';
import { IsString, MinLength } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { CommonEntity } from '../../common/entities/\bcommon.entity';
import { Question } from '../../question/entities/question.entity';

@ObjectType()
@Entity()
export class QuestionCategory extends CommonEntity {
  @Column()
  @IsString()
  @Field(() => String)
  @MinLength(2)
  categoryName: string;

  @Column()
  questionId: number;

  @ManyToOne(() => Question, (question) => question.questionCategories, {
    onDelete: 'CASCADE',
  })
  @Field(() => Question)
  @JoinColumn({ name: 'questionId' })
  question: Question;
}
