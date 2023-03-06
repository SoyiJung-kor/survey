import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';

@InputType()
export class CreateResponseCategoryInput {
  @Field(() => Int)
  @IsNumber()
  responseId: number;
  @Field(() => Int)
  @IsNumber()
  surveyId: number;
}
