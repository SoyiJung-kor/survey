import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateQuestionCategoryInput {
  @Field(() => Int)
  questionId: number;

  @Field(() => String)
  categoryName: string;
}
