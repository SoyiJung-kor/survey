/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Survey } from '../survey/entities/survey.entity';
import { CreateQuestionInput } from './dto/create-question.input';
import { UpdateQuestionInput } from './dto/update-question.input';
import { Question } from './entities/question.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    private entityManager: EntityManager,
  ) { }

  async create(input: CreateQuestionInput) {
    const question = this.questionRepository.create(input);
    question.survey = await this.entityManager.findOneById(
      Survey,
      input.surveyId,
    );
    return this.entityManager.save(question);
  }

  findAll() {
    return this.questionRepository.find();
  }

  findOne(id: number) {
    this.validQuestionById(id);
    return this.questionRepository.findOneBy({ id });
  }

  /**
   * @description "선택한 질문의 답지 조회"
   * @param id
   * @returns
   */
  async findDetail(id: number) {
    const result = await this.questionRepository
      .createQueryBuilder('question')
      // .leftJoinAndSelect('question.questionOption', 'questionOption')
      .innerJoinAndSelect('question.survey', 'survey')
      .where('question.id= :id', { id: id })
      .getMany();

    return result;
  }

  async update(id: number, updateQuestionInput: UpdateQuestionInput) {
    this.validQuestionById(id);
    const question = this.findOne(id);
    this.questionRepository.merge(await question, updateQuestionInput);
    return this.questionRepository.update(id, await question);
  }

  async remove(id: number): Promise<void> {
    const question = this.questionRepository.findOneBy({ id });
    if (!question) {
      throw new Error("CAN'T FIND THE QUENSTION!");
    }
    await this.questionRepository.delete({ id });
  }

  validQuestionById(id: number) {
    try {
      this.questionRepository.findOneBy({ id });
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
    return this.questionRepository.findOneBy({ id });
  }
}
