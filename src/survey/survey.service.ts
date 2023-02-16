import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Response } from '../response/entities/response.entity';
import { CreatePickedSurveyInput } from './dto/create-pickedSurvey.input';
import { CreateSurveyInput } from './dto/create-survey.input';
import { UpdateSurveyInput } from './dto/update-survey.input';
import { PickedSurvey } from './entities/pickedSurvey.entity';
import { Survey } from './entities/survey.entity';

@Injectable()
export class SurveyService {
  constructor(
    @InjectRepository(Survey)
    private surveyRepository: Repository<Survey>,
    private pickedSurveyRepository: Repository<PickedSurvey>,
    private entityManager: EntityManager,
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
    return this.surveyRepository.save(newPickedSurvey);
  }

  async createPickedInput(surveyId: number) {
    const pickedSurveyInput = new CreatePickedSurveyInput();
    const survey = this.findOne(surveyId);
    pickedSurveyInput.pickedSurveyTitle = (await survey).surveyTitle;
    pickedSurveyInput.surveyId = (await survey).surveyId;

    return pickedSurveyInput;
  }
}
