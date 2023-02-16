import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, FindOneOptions, Repository } from 'typeorm';
import { Answer } from '../answer/entities/answer.entity';
import { Question } from '../question/entities/question.entity';
import { Survey } from '../survey/entities/survey.entity';
import { CreateResponseInput } from './dto/create-response.input';
import { UpdateResponseInput } from './dto/update-response.input';
import { Response } from './entities/response.entity';

@Injectable()
export class ResponseService {
  constructor(
    @InjectRepository(Response)
    private responseRepository: Repository<Response>,
    private entityManager: EntityManager,
  ) {}

  async create(createResponseInput: CreateResponseInput) {
    const surveyTitle = await (
      await this.findSurvey(createResponseInput.surveyId)
    ).surveyTitle;
    const question = await await this.findQuestions(
      createResponseInput.surveyId,
    );
    for (let i = 0; i < question.length; i++) {
      const response = new Response();
      response.surveyTitle = surveyTitle;
      response.questionNumber = question[i].questionNumber;
      response.questionContent = question[i].questionContent;
    }
    return 'This action adds a new response';
  }

  findAll() {
    return `This action returns all response`;
  }

  findOne(responseId: number) {
    return `This action returns a #${responseId} response`;
  }

  update(responseId: number, updateResponseInput: UpdateResponseInput) {
    return `This action updates a #${responseId} response`;
  }

  remove(responseId: number) {
    return `This action removes a #${responseId} response`;
  }

  async findSurvey(surveyId: number) {
    const survey = await this.entityManager.findOneById(Survey, surveyId);
    return survey;
  }

  async findQuestions(surveyId: number) {
    const questions = await this.entityManager.find(Question, {
      cache: surveyId,
    });
    return questions;
  }

  async findAnswer(questionId: number) {
    const answer = await this.entityManager.find(Answer, { cache: questionId });
  }
}
