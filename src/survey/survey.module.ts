import { Module } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { SurveyResolver } from './survey.resolver';
import { Question } from '../question/entities/question.entity';
import { Response } from '../response/entities/response.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Survey } from './entities/survey.entity';

@Module({
  imports: [Question, Response, TypeOrmModule.forFeature([Survey])],
  providers: [SurveyResolver, SurveyService],
  exports: [TypeOrmModule],
})
export class SurveyModule {}
