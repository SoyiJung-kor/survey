import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateResponseInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
