import { CreateResponseCategoryInput } from './create-response-category.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateResponseCategoryInput extends PartialType(CreateResponseCategoryInput) {
  @Field(() => Int)
  id: number;
}
