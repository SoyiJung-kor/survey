import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Response } from '../response/entities/response.entity';
import { CreatePickedQuestionInput } from '../pickedQuestion/dto/create-pickedQuestion.input';
import { PickedQuestion } from '../pickedQuestion/entities/pickedQuestion.entity';
import { Question } from '../question/entities/question.entity';

@Injectable()
export class PickedQuestionService {
  constructor(
    @InjectRepository(PickedQuestion)
    private pickedQuestionRepository: Repository<PickedQuestion>,
    private entityManager: EntityManager,
  ) {}

  async createPickedQuestion(questionId: number, responseId: number) {
    const input = this.createPickQuestionInput(questionId);
    const pickedQuestion = this.pickedQuestionRepository.create(await input);
    pickedQuestion.question = await this.entityManager.findOneById(
      Question,
      questionId,
    );
    pickedQuestion.response = await this.entityManager.findOneById(
      Response,
      responseId,
    );
  }

  async createPickQuestionInput(questionId: number) {
    const pickedQuestionInput = new CreatePickedQuestionInput();
    const question = this.entityManager.findOneById(Question, questionId);
    pickedQuestionInput.pickedQuesionContent = (await question).questionContent;
    pickedQuestionInput.pickedQuestionNumber = (await question).questionNumber;

    return pickedQuestionInput;
  }
}
