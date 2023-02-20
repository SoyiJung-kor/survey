// import { Args, Int, Mutation, Resolver } from "@nestjs/graphql";
// import { ResponseSurvey } from "./entities/ResponseSurvey.entity";
// import { ResponseSurveyService } from "./ResponseSurvey.survice";

// @Resolver(() => ResponseSurvey)
// export class ResponseSurveyResolver {
//   constructor(private readonly responseSurveyService: ResponseSurveyService) {}

//   @Mutation(() => ResponseSurvey)
//   createResponseSurvey(
//     @Args("surveyId", { type: () => Int }) surveyId: number,
//     @Args("responseId", { type: () => Int }) responseId: number
//   ) {
//     return this.responseSurveyService.createResponseSurvey(
//       surveyId,
//       responseId
//     );
//   }
// }
