import { CreateQuestionInput } from './create-question.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateQuestionInput extends PartialType(CreateQuestionInput) {
  @Field(() => Int)
  questionId: number;

  @Field(() => Int)
  questionNumber?: number;

  @Field(() => String)
  questionContent?: string;

  @Field(() => Int)
  surveyId?: number;
}
