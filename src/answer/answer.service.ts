/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Question } from '../question/entities/question.entity';
import { CreateAnswerInput } from './dto/create-answer.input';
import { UpdateAnswerInput } from './dto/update-answer.input';
import { Answer } from './entities/answer.entity';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer)
    private answerRepository: Repository<Answer>,
    private entityManager: EntityManager,
  ) { }

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

  findOne(id: number) {
    this.validAnswerById(id);
    return this.answerRepository.findOneBy({ id });
  }

  async update(id: number, updateAnswerInput: UpdateAnswerInput) {
    this.validAnswerById(id);
    const answer = this.answerRepository.findOneBy({ id });
    this.answerRepository.merge(await answer, updateAnswerInput);
    return this.answerRepository.update(id, await answer);
  }

  async remove(id: number): Promise<void> {
    const answer = this.answerRepository.findOneBy({ id });
    if (!answer) {
      throw new Error("CAN'T FIND THE ANSWER!");
    }
    await this.answerRepository.delete({ id });
  }

  validAnswerById(id: number) {
    try {
      this.answerRepository.findOneBy({ id });
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
    }
  }

  // async create(input: CreateAnswerInput) {
  //   const answer = this.answerRepository.create(input);
  //   answer.question = await this.entityManager.findOneById(
  //     Question,
  //     input.questionId
  //   );
  //   return this.entityManager.save(answer);
  // }
}
