import { Module } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { SurveyResolver } from './survey.resolver';
import { Question } from '../question/entities/question.entity';
import { Response } from '../response/entities/response.entity';

@Module({
  imports:[Question, Response],
  providers: [SurveyResolver, SurveyService]
})
export class SurveyModule {}
