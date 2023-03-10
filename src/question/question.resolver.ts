
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { QuestionService } from './question.service';
import { Question } from './entities/question.entity';
import { CreateQuestionInput } from './dto/create-question.input';
import { UpdateQuestionInput } from './dto/update-question.input';

@Resolver(() => Question)
export class QuestionResolver {
  constructor(private readonly questionService: QuestionService) { }

  @Mutation(() => Question)
  createQuestion(
    @Args('input') input: CreateQuestionInput,
  ) {
    return this.questionService.create(input);
  }

  @Query(() => [Question])
  findAllQuestions() {
    return this.questionService.findAll();
  }

  @Query(() => Question)
  findQuestion(@Args('questionId', { type: () => Int }) questionId: number) {
    return this.questionService.findOne(questionId);
  }

  /**
   * @description 항목을 포함하는 질문 조회
   * @param surveyId 
   * @param categoryName 
   */
  @Query(() => [Question])
  findQuestionContainCategory(
    @Args('surveyId', { type: () => Int }) surveyId: number,
    @Args('categoryName', { type: () => String }) categoryName: string,
  ) {
    return this.questionService.findQuestionWithCategory(
      surveyId,
      categoryName,
    );
  }

  /**
  * @description 답변을 포함하는 질문 조회
  * @param answerId 질문 아이디
  * @returns Question
  */
  @Query(() => [Question])
  findQuestionWithAnswer(
    @Args('answerId', { type: () => Int }) answerId: number,
  ) {
    return this.questionService.findQuestionWithAnswer(answerId);
  }

  /**
   * @description 설문에 포함된 질문 조회
   * @param surveyId 설문 아이디
   * @returns [Question]
   */
  @Query(() => [Question])
  findQuestionWithSurvey(@Args('surveyId', { type: () => Int }) surveyId: number) {
    return this.questionService.findQuestionWithSurvey(surveyId);
  }

  @Mutation(() => Question)
  updateQuestion(
    @Args('input') input: UpdateQuestionInput,
  ) {
    return this.questionService.update(
      input
    );
  }

  @Mutation(() => Question)
  removeQuestion(@Args('questionId', { type: () => Int }) questionId: number) {
    return this.questionService.remove(questionId);
  }

  @Mutation(() => Question)
  copyQuestion(@Args('id', { type: () => Int }) id: number) {
    return this.questionService.copyQuestion(id);
  }
}
