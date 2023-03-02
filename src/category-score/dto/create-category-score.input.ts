import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNumber, IsString, MinLength } from 'class-validator';

@InputType()
export class CreateCategoryScoreInput {
  @Field(() => Int)
  @IsNumber()
  highScore: number;

  @Field(() => Int)
  @IsNumber()
  lowScore: number;

  @Field(() => String)
  @IsString()
  @MinLength(2)
  categoryMessage: string;

  @Field()
  @IsNumber()
  categoryId: number;
}
