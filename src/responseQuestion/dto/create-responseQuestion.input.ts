import { Field, Int } from '@nestjs/graphql';

export class CreateResponseQuestionInput {
  @Field(() => String)
  ResponseQuesionContent: string;

  @Field(() => Int)
  ResponseQuestionNumber: number;
}
