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

  async update(surveyId: number, updateSurveyInput: UpdateSurveyInput) {
    const survey = this.validSurveyById(surveyId);
    this.surveyRepository.merge(await survey, updateSurveyInput);
    return this.surveyRepository.save(await survey);
  }

  async remove(surveyId: number): Promise<void> {
    const survey = this.surveyRepository.findOneBy({ surveyId });
    if (!survey) {
      throw new Error("CAN'T FIND THE SURVEY!");
    }
    await this.surveyRepository.delete({ surveyId });
  }

  validSurveyById(surveyId: number) {
    try {
      this.surveyRepository.findOneBy({ surveyId });
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
    return this.surveyRepository.findOneBy({ surveyId });
  }
}
