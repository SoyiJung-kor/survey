import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CategoryScoreService } from './category-score.service';
import { CategoryScore } from './entities/category-score.entity';
import { CreateCategoryScoreInput } from './dto/create-category-score.input';
import { UpdateCategoryScoreInput } from './dto/update-category-score.input';

@Resolver(() => CategoryScore)
export class CategoryScoreResolver {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly categoryScoreService: CategoryScoreService) { }

  @Mutation(() => CategoryScore)
  createCategoryScore(
    @Args('input')
    input: CreateCategoryScoreInput,
  ) {
    return this.categoryScoreService.create(input);
  }

  @Query(() => [CategoryScore])
  findAllCategoryScores() {
    return this.categoryScoreService.findAll();
  }

  @Query(() => CategoryScore)
  findCategoryScore(@Args('id', { type: () => Int }) id: number) {
    return this.categoryScoreService.findOne(id);
  }

  @Mutation(() => CategoryScore)
  updateCategoryScore(
    @Args('updateCategoryScoreInput')
    updateCategoryScoreInput: UpdateCategoryScoreInput,
  ) {
    return this.categoryScoreService.update(
      updateCategoryScoreInput.id,
      updateCategoryScoreInput,
    );
  }

  @Mutation(() => CategoryScore)
  removeCategoryScore(@Args('id', { type: () => Int }) id: number) {
    return this.categoryScoreService.remove(id);
  }
}
