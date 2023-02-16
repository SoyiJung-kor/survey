import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateResponseAnswerInput {
  @Field(() => Int, { description: 'answer Number' })
  ResponseAnswerNumber: number;

  @Field(() => String, { description: 'answer Content' })
  ResponseAnswerContent: string;

  @Field(() => Int, { description: 'answer Score' })
  ResponseAnswerScore: number;

  @Field(() => Int)
  questionId: number;
}
