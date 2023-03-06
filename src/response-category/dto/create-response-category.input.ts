import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateResponseCategoryInput {
  @Field(() => Int)
  responseId: number;
  @Field(() => Int)
  surveyId: number;
}
