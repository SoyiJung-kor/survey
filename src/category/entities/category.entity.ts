import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { Column, JoinColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from '../../common/entity/\bcommon.entity';
import { Survey } from '../../survey/entities/survey.entity';

@ObjectType()
export class Category extends CommonEntity {
  @Field(() => String)
  @IsString()
  categoryName: string;

  @Column()
  surveyId: number;

  @ManyToOne(() => Survey, (survey) => survey.categories, { onDelete: 'CASCADE', })
  @Field(() => Survey)
  @JoinColumn({ name: 'surveyId' })
  survey: Survey;

}
