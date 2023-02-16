import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Response } from '../response/entities/response.entity';
import { CreatePickedSurveyInput } from '../pickedSurvey/dto/create-pickedSurvey.input';
import { PickedSurvey } from '../pickedSurvey/entities/pickedSurvey.entity';
import { Survey } from '../survey/entities/survey.entity';

@Injectable()
export class PickedSurveyService {
  constructor(
    @InjectRepository(Survey)
    private pickedSurveyRepository: Repository<PickedSurvey>,
    private entityManager: EntityManager,
  ) {}

  async createPickedSurvey(surveyId: number, responseId: number) {
    const input = this.createPickedInput(surveyId);
    const newPickedSurvey = this.pickedSurveyRepository.create(await input);
    newPickedSurvey.survey = await this.entityManager.findOneById(
      Survey,
      surveyId,
    );
    newPickedSurvey.response = await this.entityManager.findOneById(
      Response,
      responseId,
    );
    return this.pickedSurveyRepository.save(newPickedSurvey);
  }

  async createPickedInput(surveyId: number) {
    const pickedSurveyInput = new CreatePickedSurveyInput();
    const survey = this.entityManager.findOneById(Survey, surveyId);
    pickedSurveyInput.pickedSurveyTitle = (await survey).surveyTitle;
    pickedSurveyInput.surveyId = (await survey).surveyId;

    return pickedSurveyInput;
  }
}
