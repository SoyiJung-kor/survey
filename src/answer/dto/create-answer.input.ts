import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNumber, IsString, MinLength } from 'class-validator';

@InputType()
export class CreateAnswerInput {
  @Field(() => Int, { description: 'answer Number' })
  @IsNumber()
  answerNumber: number;

  @Field(() => String, { description: 'answer Content' })
  @IsString()
  @MinLength(2)
  answerContent: string;

  @Field(() => Int, { description: 'answer Score' })
  @IsNumber()
  answerScore: number;

  @Field(() => Int)
  questionId: number;
}
