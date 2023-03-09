
import { Injectable, Logger } from '@nestjs/common';
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
  private readonly logger = new Logger(AnswerService.name);

  async create(input: CreateAnswerInput) {
    const answer = this.answerRepository.create(input);
    answer.question = await this.createQuestion(input.questionId);
    return this.entityManager.save(answer);
  }

  async createQuestion(id: number) {
    const question = new Question();
    question.id = id;
    return question;
  }

  findAll() {
    return this.answerRepository.find();
  }

  async findOne(id: number) {
    return await this.validAnswer(id);
  }

  /**
  * @description "선택한 답지의 질문 조회"
  * @param id
  * @returns
  */
  async findDetail(id: number) {
    const result = await this.answerRepository
      .createQueryBuilder('answer')
      .innerJoinAndSelect('answer.question', 'question')
      .where(`answer.id= ${id}`)
      .getOne();

    return result;
  }

  async update(input: UpdateAnswerInput) {
    const answer = await this.validAnswer(input.id);

    if (input?.questionId) {
      const question = await this.validQuestion(input.questionId);
      answer.question = question;
    }
    this.answerRepository.merge(answer, input);
    this.answerRepository.update(input.id, answer);
    return answer;
  }
  async validQuestion(questionId: number) {
    const question = await this.entityManager.findOneBy(Question, { id: questionId });
    if (!question) {
      throw new Error("CAN'T FIND THE QUESTION!")
    }
    return question;

  }

  async remove(id: number) {
    const answer = await this.validAnswer(id);
    this.answerRepository.delete({ id });
    return answer;
  }

  async validAnswer(id: number) {
    const answer = await this.answerRepository.findOneBy({ id });
    if (!answer) {
      throw new Error(`CAN NOT FIND ANSWER! ID: ${id}`);
    }
    return answer;
  }
}
