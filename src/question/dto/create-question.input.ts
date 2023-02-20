import { InputType, Int, Field } from "@nestjs/graphql";

@InputType()
export class CreateQuestionInput {
  @Field(() => Int, { description: "question Number" })
  questionNumber: number;

  @Field(() => String, { description: "question Content" })
  questionContent: string;

  @Field(() => Int)
  surveyId: number;
}
