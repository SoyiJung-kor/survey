import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNumber, IsString, MinLength } from 'class-validator';

@InputType()
export class CreateCategoryInput {
  @Field(() => String)
  @IsString()
  @MinLength(2)
  categoryName: string;

  @Field(() => Int)
  @IsNumber()
  surveyId: number;
}
