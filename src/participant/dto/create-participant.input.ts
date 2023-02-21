import { InputType, Field } from "@nestjs/graphql";
import { IsEmail } from "class-validator";

@InputType()
export class CreateParticipantInput {
  @Field(() => String, { description: "participant email" })
  @IsEmail()
  email: string;
}
