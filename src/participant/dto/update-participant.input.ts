import { CreateParticipantInput } from './create-participant.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateParticipantInput extends PartialType(CreateParticipantInput) {
  @Field(() => Int)
  id: number;
}
