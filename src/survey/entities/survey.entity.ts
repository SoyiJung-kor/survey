import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Survey {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
