import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Question } from '../question/entities/question.entity';
import { Response } from '../response/entities/response.entity';
import { CreateAnswerInput } from './dto/create-answer.input';
import { CreatePickedAnswerInput } from './dto/create-pickedAnswer.input';
import { UpdateAnswerInput } from './dto/update-answer.input';
import { Answer } from './entities/answer.entity';
import { PickedAnswer } from './entities/pickedAnswer.entity';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer)
    private answerRepository: Repository<Answer>,
    private pickedAnswerRepository: Repository<PickedAnswer>,
    private entityManager: EntityManager,
  ) {}

  async create(input: CreateAnswerInput) {
    const answer = this.answerRepository.create(input);
    answer.question = await this.entityManager.findOneById(
      Question,
      input.questionId,
    );
    return this.entityManager.save(answer);
  }

  findAll() {
    return this.answerRepository.find();
  }

  findOne(answerId: number) {
    this.validAnswerById(answerId);
    return this.answerRepository.findOneBy({ answerId });
  }

  async update(answerId: number, updateAnswerInput: UpdateAnswerInput) {
    this.validAnswerById(answerId);
    const answer = this.answerRepository.findOneBy({ answerId });
    return this.answerRepository.merge(await answer, updateAnswerInput);
  }

  async remove(answerId: number): Promise<void> {
    const answer = this.answerRepository.findOneBy({ answerId });
    if (!answer) {
      throw new Error("CAN'T FIND THE ANSWER!");
    }
    await this.answerRepository.delete({ answerId });
  }

  validAnswerById(answerId: number) {
    try {
      this.answerRepository.findOneBy({ answerId });
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_GATEWAY,
          error: 'message',
        },
        HttpStatus.BAD_GATEWAY,
        {
          cause: error,
        },
      );
      return this.answerRepository.findOneBy({ answerId });
    }
  }

  async createPickAnswerInput(answerId: number) {
    const pickedAnswerInput = new CreatePickedAnswerInput();
    const answer = this.findOne(answerId);
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
