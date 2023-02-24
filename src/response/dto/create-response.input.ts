import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateResponseInput {
  @Field(() => Int)
  surveyId: number;

  @Field(() => Int)
  participantId: number;
}
