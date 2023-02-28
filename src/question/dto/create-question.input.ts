import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNumber, MinLength } from 'class-validator';

@InputType()
export class CreateQuestionInput {
  @Field(() => Int, { description: 'question Number' })
  @IsNumber()
  questionNumber: number;

  @Field(() => String, { description: 'question Content' })
  @MinLength(5)
  questionContent: string;

  @Field(() => Int)
  @IsNumber()
  surveyId: number;
}
