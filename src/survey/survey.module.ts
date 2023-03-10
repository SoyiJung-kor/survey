import { Module } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { SurveyResolver } from './survey.resolver';
import { getDataSourceToken, getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Survey } from './entities/survey.entity';
import { QuestionModule } from '../question/question.module';
import { ResponseModule } from '../response/response.module';
import { CategoryModule } from '../category/category.module';
import { DataSource } from 'typeorm';
import { CustomSurveyRepositoryMethods } from './repositories/survey.repository';

@Module({
  imports: [
    QuestionModule,
    ResponseModule,
    CategoryModule,
    TypeOrmModule.forFeature([Survey]),
  ],
  providers: [
    {
      provide: getRepositoryToken(Survey),
      inject: [getDataSourceToken()],
      useFactory(dataSource: DataSource) {
        return dataSource
          .getRepository(Survey)
          .extend(CustomSurveyRepositoryMethods);
      }
    },
    SurveyResolver, SurveyService],
})
export class SurveyModule { }
