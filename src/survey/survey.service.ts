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
    return this.validSurvey(id);
  }

  async update(id: number, updateSurveyInput: UpdateSurveyInput) {
    const survey = await this.validSurvey(id);
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

  async validSurvey(id: number) {
    const survey = await this.surveyRepository.findOneBy({ id });
    if (!survey) {
      throw new Error(`CAN NOT FIND SURVEY! ID: ${id}`);
    }
    return survey;
  }
}
