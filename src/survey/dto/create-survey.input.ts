import { InputType, Int, Field } from '@nestjs/graphql';
import { MinLength } from 'class-validator';

@InputType()
export class CreateSurveyInput {
  @Field(() => String, { description: '설문지 이름' })
  @MinLength(2, { message: 'title is too short!' })
  surveyTitle: string;
}
