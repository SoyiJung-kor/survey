import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';

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

  @Field(() => Category)
  @JoinColumn({ name: 'categoryId' })
  @ManyToOne(() => Category, (category) => category.categoryScores, {
    onDelete: 'CASCADE',
  })
  category: Category;
}
