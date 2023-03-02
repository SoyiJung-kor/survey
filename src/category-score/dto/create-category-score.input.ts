import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';

@InputType()
export class CreateCategoryScoreInput {
  @Field(() => Int)
  @IsNumber()
  gradeScore: number;

  @Field(() => String)
  @IsString()
  categoryMessage: string;

  @Field()
  @IsNumber()
  categoryId: number;
}
