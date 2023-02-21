import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { SurveyService } from "./survey.service";
import { Survey } from "./entities/survey.entity";
import { CreateSurveyInput } from "./dto/create-survey.input";
import { UpdateSurveyInput } from "./dto/update-survey.input";

@Resolver(() => Survey)
export class SurveyResolver {
  constructor(private readonly surveyService: SurveyService) {}

  @Mutation(() => Survey, { name: "createSurvey" })
  createSurvey(
    @Args("createSurveyInput") createSurveyInput: CreateSurveyInput
  ) {
    return this.surveyService.create(createSurveyInput);
  }

  @Query(() => [Survey], { name: "findAllSurveys" })
  findAll() {
    return this.surveyService.findAll();
  }

  @Query(() => Survey, { name: "findSurvey" })
  findOne(@Args("surveyId", { type: () => Int }) surveyId: number) {
    return this.surveyService.findOne(surveyId);
  }

  @Mutation(() => Survey, { name: "updateSurvey" })
  updateSurvey(
    @Args("updateSurveyInput") updateSurveyInput: UpdateSurveyInput
  ) {
    return this.surveyService.update(updateSurveyInput.id, updateSurveyInput);
  }

  @Mutation(() => Boolean, { name: "removeSurvey" })
  removeSurvey(@Args("surveyId", { type: () => Int }) surveyId: number) {
    this.surveyService.remove(surveyId);
    return true;
  }
}
