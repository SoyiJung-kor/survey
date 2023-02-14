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
    return 'This action adds a new survey';
  }

  findAll() {
    return `This action returns all survey`;
  }

  findOne(surveyId: number) {
    return `This action returns a #${surveyId} survey`;
  }

  update(surveyId: number, updateSurveyInput: UpdateSurveyInput) {
    return `This action updates a #${surveyId} survey`;
  }

  remove(surveyId: number) {
    return `This action removes a #${surveyId} survey`;
  }
}
