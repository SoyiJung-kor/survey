// import { Injectable } from "@nestjs/common";
// import { InjectRepository } from "@nestjs/typeorm";
// import { EntityManager, Repository } from "typeorm";
// import { Response } from "../response/entities/response.entity";
// import { CreateResponseSurveyInput } from "./dto/create-ResponseSurvey.input";
// import { ResponseSurvey } from "./entities/ResponseSurvey.entity";
// import { Survey } from "../survey/entities/survey.entity";

// @Injectable()
// export class ResponseSurveyService {
//   constructor(
//     @InjectRepository(ResponseSurvey)
//     private ResponseSurveyRepository: Repository<ResponseSurvey>,
//     private entityManager: EntityManager
//   ) {}

//   async createResponseSurvey(surveyId: number, responseId: number) {
//     const input = this.createResponseInput(surveyId);
//     const newResponseSurvey = this.ResponseSurveyRepository.create(await input);
//     newResponseSurvey.survey = await this.entityManager.findOneById(
//       Survey,
//       surveyId
//     );
//     newResponseSurvey.response = await this.entityManager.findOneById(
//       Response,
//       responseId
//     );
//     return this.ResponseSurveyRepository.save(newResponseSurvey);
//   }

//   async createResponseInput(surveyId: number) {
//     const ResponseSurveyInput = new CreateResponseSurveyInput();
//     const survey = this.entityManager.findOneById(Survey, surveyId);
//     ResponseSurveyInput.ResponseSurveyTitle = (await survey).surveyTitle;
//     ResponseSurveyInput.surveyId = (await survey).id;

//     return ResponseSurveyInput;
//   }
// }
