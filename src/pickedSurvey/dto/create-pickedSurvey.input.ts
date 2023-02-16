import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreatePickedSurveyInput {
  @Field(() => String, { description: '설문지 이름' })
  pickedSurveyTitle: string;

  @Field(() => Int)
  surveyId: number;
}
