import { Injectable } from '@nestjs/common';
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
  ) {}

  create(createSurveyInput: CreateSurveyInput) {
    const newSurvey = this.surveyRepository.create(createSurveyInput);
    return this.surveyRepository.save(newSurvey);
  }

  findAll() {
    return this.surveyRepository.find();
  }

  findOne(surveyId: number) {
    this.validSurveyById(surveyId);
    return this.surveyRepository.findOneBy({ surveyId });
  }

  update(surveyId: number, updateSurveyInput: UpdateSurveyInput) {
    return `This action updates a #${surveyId} survey`;
  }

  remove(surveyId: number) {
    return `This action removes a #${surveyId} survey`;
  }

  validSurveyById(surveyId: number) {
    try {
      const survey = this.surveyRepository.findOneBy({ surveyId });
    } catch {
      throw "CAN'T FIND THE SURVEY";
    }
  }
}
