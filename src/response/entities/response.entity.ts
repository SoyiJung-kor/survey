import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Response {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
