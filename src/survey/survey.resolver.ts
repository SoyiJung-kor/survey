/* eslint-disable prettier/prettier */
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
    @Args('createSurveyInput') createSurveyInput: CreateSurveyInput,
  ) {
    return this.surveyService.create(createSurveyInput);
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
   * @description 설문에 포함된 항목 조회
   * @param id 설문 아이디
   * @returns 
   */
  @Query(() => Survey)
  findSurveyWithCategory(@Args('id', { type: () => Int }) id: number) {
    return this.surveyService.findCategory(id);
  }

  /**
     * @description 설문에 포함된 질문 조회
     * @param id 설문 아이디
     * @returns 
     */
  @Query(() => Survey)
  findSurveyWithQuestion(@Args('id', { type: () => Int }) id: number) {
    return this.surveyService.findQuestion(id);
  }

  @Mutation(() => Survey)
  updateSurvey(
    @Args('input') input: UpdateSurveyInput,
  ) {
    return this.surveyService.update(input);
  }

  @Mutation(() => Survey, { name: 'removeSurvey' })
  removeSurvey(@Args('surveyId', { type: () => Int }) surveyId: number) {
    return this.surveyService.remove(surveyId);
  }
}
