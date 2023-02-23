import { Module } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { SurveyResolver } from './survey.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Survey } from './entities/survey.entity';
import { QuestionModule } from '../question/question.module';
import { ResponseModule } from '../response/response.module';

@Module({
  imports: [QuestionModule, ResponseModule, TypeOrmModule.forFeature([Survey])],
  providers: [SurveyResolver, SurveyService],
  exports: [TypeOrmModule],
})
export class SurveyModule {}
