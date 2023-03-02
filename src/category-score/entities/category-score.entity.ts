import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class CategoryScore {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
