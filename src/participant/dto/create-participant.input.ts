import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateParticipantInput {
  @Field(() => String, { description: 'participant email' })
  email: string;
}
