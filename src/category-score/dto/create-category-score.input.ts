import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateCategoryScoreInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
