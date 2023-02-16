import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateResponseInput {
  @Field(() => Int)
  participantId: number;
}
