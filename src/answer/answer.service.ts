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

  update(answerId: number, updateAnswerInput: UpdateAnswerInput) {
    return `This action updates a #${answerId} answer`;
  }

  remove(answerId: number) {
    return `This action removes a #${answerId} answer`;
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
}
