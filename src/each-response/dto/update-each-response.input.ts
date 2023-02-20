import { CreateEachResponseInput } from "./create-each-response.input";
import { InputType, Field, Int, PartialType } from "@nestjs/graphql";

@InputType()
export class UpdateEachResponseInput extends PartialType(
  CreateEachResponseInput
) {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  responseId?: number;

  @Field(() => String)
  responseQuestion?: string;

  @Field(() => String)
  responseAnswer?: string;

  @Field(() => Int)
  responseScore?: number;
}
