import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';

@Resolver(() => Category)
export class CategoryResolver {

  constructor(private readonly categoryService: CategoryService) { }

  @Mutation(() => Category)
  createCategory(@Args('input') input: CreateCategoryInput) {
    return this.categoryService.create(input);
  }

  @Query(() => [Category])
  findAllCategories() {
    return this.categoryService.findAll();
  }

  @Query(() => Category)
  findCategory(@Args('id', { type: () => Int }) id: number) {
    return this.categoryService.findOne(id);
  }

  /**
   * @description 설문에 포함된 항목 조회
   * @param surveyId 설문아이디
   * @returns [Category]
   */
  @Query(() => [Category])
  findCategoryWithSurvey(@Args('surveyId', { type: () => Int }) surveyId: number) {
    return this.categoryService.findSurveyWithCategory(surveyId);
  }
  @Mutation(() => Category)
  updateCategory(@Args('input') input: UpdateCategoryInput) {
    return this.categoryService.update(input);
  }

  @Mutation(() => Category)
  removeCategory(@Args('id', { type: () => Int }) id: number) {
    return this.categoryService.remove(id);
  }
}
