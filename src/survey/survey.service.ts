import { Injectable } from '@nestjs/common';
import { CreateSurveyInput } from './dto/create-survey.input';
import { UpdateSurveyInput } from './dto/update-survey.input';

@Injectable()
export class SurveyService {
  create(createSurveyInput: CreateSurveyInput) {
    return 'This action adds a new survey';
  }

  findAll() {
    return `This action returns all survey`;
  }

  findOne(id: number) {
    return `This action returns a #${id} survey`;
  }

  update(id: number, updateSurveyInput: UpdateSurveyInput) {
    return `This action updates a #${id} survey`;
  }

  remove(id: number) {
    return `This action removes a #${id} survey`;
  }
}
