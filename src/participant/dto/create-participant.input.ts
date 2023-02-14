import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateParticipantInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
