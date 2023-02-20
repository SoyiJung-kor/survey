import { InputType, Int, Field } from "@nestjs/graphql";

@InputType()
export class CreateResponseSurveyInput {
  @Field(() => String, { description: "설문지 이름" })
  ResponseSurveyTitle: string;

  @Field(() => Int)
  surveyId: number;
}
