import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateResponseInput {
  @Field(() => Int, { description: 'participant Id' })
  participantId: number;

  @Field(() => Int, { description: 'survey Id' })
  surveyId: number;
}
