import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';

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
  categoryMessage: string;

  @Field()
  @IsNumber()
  categoryId: number;
}
