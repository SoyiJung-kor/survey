import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { CreateResponseAnswerInput } from './dto/create-ResponseAnswer.input';
import { Answer } from '../answer/entities/answer.entity';
import { Response } from '../response/entities/response.entity';
import { ResponseAnswer } from './entities/ResponseAnswer.entity';

@Injectable()
export class ResponseAnswerService {
  constructor(
    @InjectRepository(ResponseAnswer)
    private ResponseAnswerRepository: Repository<ResponseAnswer>,
    private entityManager: EntityManager,
  ) {}

  async createPickAnswerInput(answerId: number) {
    const ResponseAnswerInput = new CreateResponseAnswerInput();
    const answer = this.entityManager.findOneById(Answer, answerId);
    ResponseAnswerInput.ResponseAnswerContent = (await answer).answerContent;
    ResponseAnswerInput.ResponseAnswerNumber = (await answer).answerNumber;
    ResponseAnswerInput.ResponseAnswerScore = (await answer).answerScore;
    ResponseAnswerInput.questionId = (await answer).questionId;

    return ResponseAnswerInput;
  }

  async createResponseAnswer(answerId: number, responseId: number) {
    const input = this.createPickAnswerInput(answerId);
    const ResponseAnswer = this.ResponseAnswerRepository.create(await input);
    ResponseAnswer.answer = await this.entityManager.findOneById(
      Answer,
      answerId,
    );
    ResponseAnswer.response = await this.entityManager.findOneById(
      Response,
      responseId,
    );
    return this.entityManager.save(ResponseAnswer);
  }
}
