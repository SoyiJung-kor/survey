
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SurveyService } from './survey.service';
import { Survey } from './entities/survey.entity';
import { CreateSurveyInput } from './dto/create-survey.input';
import { UpdateSurveyInput } from './dto/update-survey.input';

@Resolver(() => Survey)
export class SurveyResolver {
  constructor(private readonly surveyService: SurveyService) { }

  @Mutation(() => Survey)
  createSurvey(
    @Args('input') input: CreateSurveyInput,
  ) {
    return this.surveyService.create(input);
  }

  @Query(() => [Survey])
  findAllSurveys() {
    return this.surveyService.findAll();
  }

  @Query(() => Survey)
  findSurvey(@Args('surveyId', { type: () => Int }) surveyId: number) {
    return this.surveyService.findOne(surveyId);
  }

  /**
   * @description 항목이름이 포함된 설문 조회
   * @param categoryName 항목의 이름
   * @returns [Survey]
   */
  @Query(() => Survey)
  findSurveyWithCategory(@Args('categoryName', { type: () => String }) categoryName: string) {
    return this.surveyService.findSurveyWithCategory(categoryName);
  }

  /**
   * @description 질문이 포함된 설문 조회
   * @param questionId 질문 아이디
   * @returns Survey
   */
  @Query(() => Survey)
  findSurveyWithQuestion(@Args('questionId', { type: () => Int }) questionId: number) {
    return this.surveyService.findSurveyWithQuestion(questionId);
  }

  @Mutation(() => Survey)
  updateSurvey(
    @Args('input') input: UpdateSurveyInput,
  ) {
    return this.surveyService.update(input);
  }

  @Mutation(() => Survey)
  removeSurvey(@Args('surveyId', { type: () => Int }) surveyId: number) {
    return this.surveyService.remove(surveyId);
  }
}
