
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ResponseCategoryService } from './response-category.service';
import { ResponseCategory } from './entities/response-category.entity';
import { CreateResponseCategoryInput } from './dto/create-response-category.input';
import { UpdateResponseCategoryInput } from './dto/update-response-category.input';

@Resolver(() => ResponseCategory)
export class ResponseCategoryResolver {
  constructor(
    private readonly responseCategoryService: ResponseCategoryService,
  ) { }

  @Mutation(() => [ResponseCategory])
  createResponseCategory(
    @Args('input')
    input: CreateResponseCategoryInput,
  ) {
    return this.responseCategoryService.create(input);
  }

  @Query(() => [ResponseCategory])
  findAllResponseCategory() {
    return this.responseCategoryService.findAll();
  }

  @Query(() => ResponseCategory)
  findResponseCategory(@Args('id', { type: () => Int }) id: number) {
    return this.responseCategoryService.findOne(id);
  }

  @Mutation(() => [ResponseCategory])
  sumResponseCategory(
    @Args('input')
    input: UpdateResponseCategoryInput,
  ) {
    return this.responseCategoryService.sumCategoryScore(input);
  }

  @Mutation(() => ResponseCategory)
  removeResponseCategory(@Args('id', { type: () => Int }) id: number) {
    return this.responseCategoryService.remove(id);
  }

  @Mutation(() => [ResponseCategory])
  compareScore(@Args('responseId', { type: () => Int }) responseId: number,
    @Args('surveyId', { type: () => Int }) surveyId: number) {
    return this.responseCategoryService.compareScore(responseId, surveyId);
  }
}
