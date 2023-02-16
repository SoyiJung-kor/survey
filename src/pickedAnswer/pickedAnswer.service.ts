import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { CreatePickedAnswerInput } from './dto/create-pickedAnswer.input';
import { Answer } from '../answer/entities/answer.entity';
import { Response } from '../response/entities/response.entity';
import { PickedAnswer } from './entities/pickedAnswer.entity';

@Injectable()
export class PickedAnswerService {
  constructor(
    @InjectRepository(PickedAnswer)
    private pickedAnswerRepository: Repository<PickedAnswer>,
    private entityManager: EntityManager,
  ) {}

  async createPickAnswerInput(answerId: number) {
    const pickedAnswerInput = new CreatePickedAnswerInput();
    const answer = this.entityManager.findOneById(Answer, answerId);
    pickedAnswerInput.pickedAnswerContent = (await answer).answerContent;
    pickedAnswerInput.pickedAnswerNumber = (await answer).answerNumber;
    pickedAnswerInput.pickedAnswerScore = (await answer).answerScore;
    pickedAnswerInput.questionId = (await answer).questionId;

    return pickedAnswerInput;
  }

  async createPickedAnswer(answerId: number, responseId: number) {
    const input = this.createPickAnswerInput(answerId);
    const pickedAnswer = this.pickedAnswerRepository.create(await input);
    pickedAnswer.answer = await this.entityManager.findOneById(
      Answer,
      answerId,
    );
    pickedAnswer.response = await this.entityManager.findOneById(
      Response,
      responseId,
    );
    return this.entityManager.save(pickedAnswer);
  }
}
