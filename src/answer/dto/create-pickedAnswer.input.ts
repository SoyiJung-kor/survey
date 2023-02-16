import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreatePickedAnswerInput {
  @Field(() => Int, { description: 'answer Number' })
  pickedAnswerNumber: number;

  @Field(() => String, { description: 'answer Content' })
  pickedAnswerContent: string;

  @Field(() => Int, { description: 'answer Score' })
  pickedAnswerScore: number;

  @Field(() => Int)
  answerId: number;
}
