
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSurveyInput } from './dto/create-survey.input';
import { UpdateSurveyInput } from './dto/update-survey.input';
import { Survey } from './entities/survey.entity';
import { SurveyRepository } from './repositories/survey.repository';

@Injectable()
export class SurveyService {
  constructor(
    @InjectRepository(Survey)
    private readonly surveyRepository: SurveyRepository,
  ) { }

  private readonly logger = new Logger(SurveyService.name);

  create(input: CreateSurveyInput) {
    const newSurvey = this.surveyRepository.create(input);
    return this.surveyRepository.save(newSurvey);
  }

  findAll() {
    return this.surveyRepository.find();
  }

  findOne(id: number) {
    return this.validSurvey(id);
  }

  /**
   * @description 항목이름이 포함된 설문 조회
   * @param categoryName 
   * @returns [Survey]
   */
  findSurveyWithCategory(categoryName: string) {
    return this.surveyRepository.findSurveyWithCategory(categoryName);
  }

  findSurveyWithQuestion(questionId: number) {
    return this.surveyRepository.findSurveyWithQuestion(questionId);
  }

  async update(input: UpdateSurveyInput) {
    const survey = await this.validSurvey(input.id);
    this.surveyRepository.merge(survey, input);
    this.surveyRepository.update(input.id, survey);
    return survey;
  }

  async remove(id: number) {
    const survey = await this.validSurvey(id);
    this.surveyRepository.delete({ id });
    return survey;
  }

  async validSurvey(id: number) {
    try {
      const survey = await this.surveyRepository.findOneBy({ id });

      return survey;
    } catch (error) {
      throw new HttpException(
        {
          message: `SQL ERROR`,
          error: error.sqlMessage,
        },
        HttpStatus.FORBIDDEN,
      );
    }

    // if (!survey) {
    //   throw new Error(`CAN NOT FIND SURVEY! ID: ${id}`);
    // }
    // return survey;
  }
}
