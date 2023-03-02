import { CreateCategoryScoreInput } from './create-category-score.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCategoryScoreInput extends PartialType(
  CreateCategoryScoreInput,
) {
  @Field(() => Int)
  id: number;
}
