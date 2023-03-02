import { CreateQuestionCategoryInput } from './create-question-category.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateQuestionCategoryInput extends PartialType(CreateQuestionCategoryInput) {
  @Field(() => Int)
  id: number;
}
