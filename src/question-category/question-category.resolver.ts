import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { QuestionCategoryService } from './question-category.service';
import { QuestionCategory } from './entities/question-category.entity';
import { CreateQuestionCategoryInput } from './dto/create-question-category.input';
import { UpdateQuestionCategoryInput } from './dto/update-question-category.input';

@Resolver(() => QuestionCategory)
export class QuestionCategoryResolver {
  constructor(private readonly questionCategoryService: QuestionCategoryService) {}

  @Mutation(() => QuestionCategory)
  createQuestionCategory(@Args('createQuestionCategoryInput') createQuestionCategoryInput: CreateQuestionCategoryInput) {
    return this.questionCategoryService.create(createQuestionCategoryInput);
  }

  @Query(() => [QuestionCategory], { name: 'questionCategory' })
  findAll() {
    return this.questionCategoryService.findAll();
  }

  @Query(() => QuestionCategory, { name: 'questionCategory' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.questionCategoryService.findOne(id);
  }

  @Mutation(() => QuestionCategory)
  updateQuestionCategory(@Args('updateQuestionCategoryInput') updateQuestionCategoryInput: UpdateQuestionCategoryInput) {
    return this.questionCategoryService.update(updateQuestionCategoryInput.id, updateQuestionCategoryInput);
  }

  @Mutation(() => QuestionCategory)
  removeQuestionCategory(@Args('id', { type: () => Int }) id: number) {
    return this.questionCategoryService.remove(id);
  }
}
