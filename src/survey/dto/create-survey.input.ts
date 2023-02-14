import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateSurveyInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
