import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateSurveyInput {
  @Field(() => String, { description: '설문지 이름' })
  surveyTitle: string;
}
