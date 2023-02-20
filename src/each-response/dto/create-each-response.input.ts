import { InputType, Int, Field } from "@nestjs/graphql";

@InputType()
export class CreateEachResponseInput {
  @Field(() => Int, { description: "response ID" })
  responseId: number;

  @Field(() => String, { description: "response Question" })
  responseQuestion: string;

  @Field(() => String, { description: "response Answer" })
  responseAnswer: string;

  @Field(() => Int, { description: "response Score" })
  responseScore: number;
}
