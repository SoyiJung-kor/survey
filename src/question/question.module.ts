import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionResolver } from './question.resolver';
import { getDataSourceToken, getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { AnswerModule } from '../answer/answer.module';
import { Question } from './entities/question.entity';
import { QuestionCategoryModule } from '../question-category/question-category.module';
import { DataSource } from 'typeorm';
import { CustomQuestionRepositoryMethods } from './repositories/question.repository';

@Module({
  imports: [
    AnswerModule,
    QuestionCategoryModule,
    TypeOrmModule.forFeature([Question]),
  ],
  providers: [
    {
      provide: getRepositoryToken(Question),
      inject: [getDataSourceToken()],
      useFactory(dataSource: DataSource) {
        return dataSource
          .getRepository(Question)
          .extend(CustomQuestionRepositoryMethods);
      }
    }
    , QuestionResolver, QuestionService],
})
export class QuestionModule { }
