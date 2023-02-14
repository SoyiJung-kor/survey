import { CreateResponseInput } from './create-response.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateResponseInput extends PartialType(CreateResponseInput) {
  @Field(() => Int)
  id: number;
}
