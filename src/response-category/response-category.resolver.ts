/* eslint-disable prettier/prettier */
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

  @Query(() => [ResponseCategory], { name: 'responseCategory' })
  findAll() {
    return this.responseCategoryService.findAll();
  }

  @Query(() => ResponseCategory, { name: 'responseCategory' })
  findOne(@Args('id', { type: () => Int }) id: number) {
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
}
