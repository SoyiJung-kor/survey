import { InputType, Int, Field } from '@nestjs/graphql';
import { IsString, MinLength } from 'class-validator';

@InputType()
export class CreateQuestionCategoryInput {
  @Field(() => Int)
  questionId: number;

  @Field(() => String)
  @MinLength(2)
  @IsString()
  categoryName: string;
}
