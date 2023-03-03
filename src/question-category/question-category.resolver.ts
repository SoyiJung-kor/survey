import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { QuestionCategoryService } from './question-category.service';
import { QuestionCategory } from './entities/question-category.entity';
import { CreateQuestionCategoryInput } from './dto/create-question-category.input';
import { UpdateQuestionCategoryInput } from './dto/update-question-category.input';
import { Question } from '../question/entities/question.entity';

@Resolver(() => QuestionCategory)
export class QuestionCategoryResolver {
  constructor(
    private readonly questionCategoryService: QuestionCategoryService,
  ) { }

  @Mutation(() => QuestionCategory)
  createQuestionCategory(
    @Args('input')
    input: CreateQuestionCategoryInput,
  ) {
    return this.questionCategoryService.create(input);
  }

  @Query(() => [QuestionCategory])
  findAllQuestionCategories() {
    return this.questionCategoryService.findAll();
  }

  @Query(() => QuestionCategory)
  findQuestionCategory(@Args('id', { type: () => Int }) id: number) {
    return this.questionCategoryService.findOne(id);
  }

  @Mutation(() => QuestionCategory)
  updateQuestionCategory(@Args('input') input: UpdateQuestionCategoryInput) {
    return this.questionCategoryService.update(input);
  }

  @Mutation(() => QuestionCategory)
  removeQuestionCategory(@Args('id', { type: () => Int }) id: number) {
    return this.questionCategoryService.remove(id);
  }
}
