import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { PickedSurvey } from './entities/pickedSurvey.entity';
import { PickedSurveyService } from './pickedSurvey.survice';

@Resolver(() => PickedSurvey)
export class PickedSurveyResolver {
  constructor(private readonly pickedSurveyService: PickedSurveyService) {}

  @Mutation(() => PickedSurvey)
  createPickedSurvey(
    @Args('surveyId', { type: () => Int }) surveyId: number,
    @Args('responseId', { type: () => Int }) responseId: number,
  ) {
    return this.pickedSurveyService.createPickedSurvey(surveyId, responseId);
  }
}
