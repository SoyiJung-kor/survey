import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNumber, IsString, MinLength } from 'class-validator';

@InputType()
export class CreateQuestionCategoryInput {
  @Field(() => Int)
  @IsNumber()
  questionId: number;

  @Field(() => String)
  @MinLength(2)
  @IsString()
  categoryName: string;
}
