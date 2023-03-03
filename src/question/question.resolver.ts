/* eslint-disable prettier/prettier */
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { QuestionService } from './question.service';
import { Question } from './entities/question.entity';
import { CreateQuestionInput } from './dto/create-question.input';
import { UpdateQuestionInput } from './dto/update-question.input';

@Resolver(() => Question)
export class QuestionResolver {
  constructor(private readonly questionService: QuestionService) { }

  @Mutation(() => Question, { name: 'createQuestion' })
  createQuestion(
    @Args('createQuestionInput') createQuestionInput: CreateQuestionInput,
  ) {
    return this.questionService.create(createQuestionInput);
  }

  @Query(() => [Question], { name: 'findAllQuestions' })
  findAll() {
    return this.questionService.findAll();
  }

  @Query(() => Question, { name: 'findQuestion' })
  findOne(@Args('questionId', { type: () => Int }) questionId: number) {
    return this.questionService.findOne(questionId);
  }

  @Query(() => Question)
  findOneQuestionDetail(@Args('id', { type: () => Int }) id: number) {
    return this.questionService.findDetail(id);
  }

  @Query(() => [Question])
  findQuestionContainCategory(
    @Args('surveyId', { type: () => Int }) surveyId: number,
    @Args('categoryName', { type: () => String }) categoryName: string,
  ) {
    return this.questionService.findQuestionContainCategory(
      surveyId,
      categoryName,
    );
  }

  /**
   * @description 질문이 포함하는 항목 조회
   * @param id question id
   * @returns 
   */
  @Query(() => Question)
  findQuestionWithCategory(@Args('id', { type: () => Int }) id: number,) {
    return this.questionService.findQuestionWithCategory(id);
  }

  @Mutation(() => Question, { name: 'updateQuestion' })
  updateQuestion(
    @Args('updateQuestionInput') updateQuestionInput: UpdateQuestionInput,
  ) {
    return this.questionService.update(
      updateQuestionInput.id,
      updateQuestionInput,
    );
  }

  @Mutation(() => Question, { name: 'removeQuestion' })
  removeQuestion(@Args('questionId', { type: () => Int }) questionId: number) {
    return this.questionService.remove(questionId);
  }
}
