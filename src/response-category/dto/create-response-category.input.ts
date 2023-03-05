import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateResponseCategoryInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
