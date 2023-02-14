import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SurveyService } from './survey.service';
import { Survey } from './entities/survey.entity';
import { CreateSurveyInput } from './dto/create-survey.input';
import { UpdateSurveyInput } from './dto/update-survey.input';

@Resolver(() => Survey)
export class SurveyResolver {
  constructor(private readonly surveyService: SurveyService) {}

  @Mutation(() => Survey)
  createSurvey(@Args('createSurveyInput') createSurveyInput: CreateSurveyInput) {
    return this.surveyService.create(createSurveyInput);
  }

  @Query(() => [Survey], { name: 'survey' })
  findAll() {
    return this.surveyService.findAll();
  }

  @Query(() => Survey, { name: 'survey' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.surveyService.findOne(id);
  }

  @Mutation(() => Survey)
  updateSurvey(@Args('updateSurveyInput') updateSurveyInput: UpdateSurveyInput) {
    return this.surveyService.update(updateSurveyInput.id, updateSurveyInput);
  }

  @Mutation(() => Survey)
  removeSurvey(@Args('id', { type: () => Int }) id: number) {
    return this.surveyService.remove(id);
  }
}
