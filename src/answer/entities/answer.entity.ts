import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Answer {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
