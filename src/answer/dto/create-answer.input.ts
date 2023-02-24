import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateAnswerInput {
  @Field(() => Int, { description: 'answer Number' })
  answerNumber: number;

  @Field(() => String, { description: 'answer Content' })
  answerContent: string;

  @Field(() => Int, { description: 'answer Score' })
  answerScore: number;

  @Field(() => Int)
  questionId: number;
}
