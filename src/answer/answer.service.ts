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
    answer.question = await this.entityManager.findOne(Question, {
      where: { questionId: input.questionId },
    });
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
    this.answerRepository.merge(await answer, updateAnswerInput);
    return this.answerRepository.update(answerId, await answer);
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
}
