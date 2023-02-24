import { CreateEachResponseInput } from './create-each-response.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateEachResponseInput extends PartialType(
  CreateEachResponseInput,
) {
  @Field(() => Int)
  id: number;
}
