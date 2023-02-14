import { CreateAnswerInput } from './create-answer.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateAnswerInput extends PartialType(CreateAnswerInput) {
  @Field(() => Int)
  id: number;
}
