import { ObjectType, Field, Int } from '@nestjs/graphql';
import { MinLength } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { Question } from '../../question/entities/question.entity';
import { Response } from '../../response/entities/response.entity';

@ObjectType()
@Entity()
export class Survey {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column()
  @MinLength(2, { message: 'title is too short!' })
  surveyTitle: string;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;

  @DeleteDateColumn()
  readonly deletedAt: Date;

  @OneToMany(() => Question, (question) => question.survey, { cascade: true })
  @Field(() => [Question], { nullable: true })
  questions: Question[];

  @OneToMany(() => Response, (response) => response.survey, { cascade: true })
  @Field(() => [Response], { nullable: true })
  response: Response[];

  @OneToMany(() => Category, (category) => category.survey, { cascade: true })
  @Field(() => [Category], { nullable: true })
  categories: Category[];
}
