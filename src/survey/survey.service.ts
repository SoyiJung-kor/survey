/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSurveyInput } from './dto/create-survey.input';
import { UpdateSurveyInput } from './dto/update-survey.input';
import { Survey } from './entities/survey.entity';

@Injectable()
export class SurveyService {
  constructor(
    @InjectRepository(Survey)
    private surveyRepository: Repository<Survey>,
  ) { }

  private readonly logger = new Logger(SurveyService.name);

  create(createSurveyInput: CreateSurveyInput) {
    const newSurvey = this.surveyRepository.create(createSurveyInput);
    return this.surveyRepository.save(newSurvey);
  }

  findAll() {
    return this.surveyRepository.find();
  }

  findOne(id: number) {
    return this.validSurvey(id);
  }

  /**
   * @description "설문이 갖고 있는 항목 조회"
   * @param id 
   * @returns 
   */
  async findCategory(id: number) {
    const result = await this.surveyRepository
      .createQueryBuilder('survey')
      .leftJoinAndSelect('survey.categories', 'category')
      .where(`survey.id= :${id}`)
      .getOne();

    return result;
  }

  /**
   * @description "설문이 갖고 있는 질문 조회"
   * @param id 
   * @returns 
   */
  async findQuestion(id: number) {
    const result = await this.surveyRepository
      .createQueryBuilder('survey')
      .leftJoinAndSelect('survey.questions', 'question')
      .where(`survey.id= :${id}`)
      .getOne();

    return result;
  }

  async update(id: number, updateSurveyInput: UpdateSurveyInput) {
    const survey = await this.validSurvey(id);
    this.surveyRepository.merge(survey, updateSurveyInput);
    this.surveyRepository.update(id, survey);
    return survey;
  }

  async remove(id: number) {
    const survey = await this.validSurvey(id);
    await this.surveyRepository.delete({ id });
    return survey;
  }

  async validSurvey(id: number) {
    const survey = await this.surveyRepository.findOneBy({ id });
    if (!survey) {
      throw new Error(`CAN NOT FIND SURVEY! ID: ${id}`);
    }
    return survey;
  }
}
