/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
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

  private readonly logger = new Logger(QuestionService.name);

  async create(input: CreateQuestionInput) {
    const question = this.questionRepository.create(input);
    // const survey = new Survey()
    // survey.id = input.surveyId
    // question.survey = survey
    question.survey = await this.entityManager.findOneBy(
      Survey,
      { id: input.surveyId },
    );
    return this.entityManager.save(question);
  }

  findAll() {
    return this.questionRepository.find();
  }

  findOne(id: number) {
    return this.validQuestion(id);
  }

  /**
   * @description "선택한 질문의 답지 조회"
   * @param id
   * @returns
   */
  async findDetail(id: number) {
    const result = await this.questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.answers', 'answer')
      .innerJoinAndSelect('question.survey', 'survey')
      .where(`question.id = ${id}`)
      .getOne();

    return result;
  }

  async update(id: number, updateQuestionInput: UpdateQuestionInput) {
    const question = await this.validQuestion(id);
    this.questionRepository.merge(question, updateQuestionInput);
    this.questionRepository.update(id, question);
    return question;
  }

  async validSurvey(surveyId: number) {
    const survey = await this.entityManager.findOneBy(Survey, { id: surveyId });
    if (!survey) {
      throw new Error("CAN'T FIND THE SURVEY!")
    } else {
      return survey;
    }
  }
  async remove(id: number) {
    const question = this.questionRepository.findOneBy({ id });
    if (!question) {
      throw new Error("CAN'T FIND THE QUENSTION!");
    }
    await this.questionRepository.delete({ id });
    return question;
  }

  async validQuestion(id: number) {
    const question = await this.questionRepository.findOneBy({ id });
    if (!question) {
      throw new Error(`CAN NOT FIND QUESTION! ID: ${id}`);
    }
    return question;
  }
}
