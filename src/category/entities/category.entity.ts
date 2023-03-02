import { ObjectType, Field } from '@nestjs/graphql';
import { IsString, MinLength } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from '../../common/entities/\bcommon.entity';
import { Survey } from '../../survey/entities/survey.entity';

@ObjectType()
@Entity()
export class Category extends CommonEntity {
  @Field(() => String)
  @IsString()
  @Column()
  @MinLength(2)
  categoryName: string;

  @Column()
  surveyId: number;

  @Field(() => Survey)
  @JoinColumn({ name: 'surveyId' })
  @ManyToOne(() => Survey, (survey) => survey.categories, {
    onDelete: 'CASCADE',
  })
  survey: Survey;
}
