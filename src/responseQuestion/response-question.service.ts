// import { Injectable } from "@nestjs/common";
// import { InjectRepository } from "@nestjs/typeorm";
// import { EntityManager, Repository } from "typeorm";
// import { Response } from "../response/entities/response.entity";
// import { Question } from "../question/entities/question.entity";
// import { CreateResponseQuestionInput } from "./dto/create-responseQuestion.input";
// import { ResponseQuestion } from "./entities/response-question.entity";

// @Injectable()
// export class ResponseQuestionService {
//   constructor(
//     @InjectRepository(ResponseQuestion)
//     private ResponseQuestionRepository: Repository<ResponseQuestion>,
//     private entityManager: EntityManager
//   ) {}

//   async createResponseQuestion(questionId: number, responseId: number) {
//     const input = this.createPickQuestionInput(questionId);
//     const ResponseQuestion = this.ResponseQuestionRepository.create(
//       await input
//     );
//     ResponseQuestion.question = await this.entityManager.findOneById(
//       Question,
//       questionId
//     );
//     ResponseQuestion.response = await this.entityManager.findOneById(
//       Response,
//       responseId
//     );
//   }

//   async createPickQuestionInput(questionId: number) {
//     const ResponseQuestionInput = new CreateResponseQuestionInput();
//     const question = this.entityManager.findOneById(Question, questionId);
//     ResponseQuestionInput.ResponseQuesionContent = (
//       await question
//     ).questionContent;
//     ResponseQuestionInput.ResponseQuestionNumber = (
//       await question
//     ).questionNumber;

//     return ResponseQuestionInput;
//   }
// }
