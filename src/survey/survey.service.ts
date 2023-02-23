/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

  create(createSurveyInput: CreateSurveyInput) {
    const newSurvey = this.surveyRepository.create(createSurveyInput);
    return this.surveyRepository.save(newSurvey);
  }

  findAll() {
    return this.surveyRepository.find();
  }

  findOne(id: number) {
    this.validSurveyById(id);
    return this.surveyRepository.findOneBy({ id });
  }

  async update(id: number, updateSurveyInput: UpdateSurveyInput) {
    const survey = await this.validSurveyById(id);
    this.surveyRepository.merge(survey, updateSurveyInput);
    return survey;
  }

  async remove(id: number) {
    const survey = this.surveyRepository.findOneBy({ id });
    if (!survey) {
      throw new Error("CAN'T FIND THE SURVEY!");
    }
    await this.surveyRepository.delete({ id });
    return survey;
  }

  validSurveyById(id: number) {
    try {
      this.surveyRepository.findOneBy({ id });
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
    return this.surveyRepository.findOneBy({ id });
  }
}
