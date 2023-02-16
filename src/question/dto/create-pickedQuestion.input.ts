import { Field, Int } from '@nestjs/graphql';

export class CreatePickedQuestionInput {
  @Field(() => String)
  pickedQuesionContent: string;

  @Field(() => Int)
  pickedQuestionNumber: number;
}
