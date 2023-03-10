import { Module } from '@nestjs/common';
import { QuestionCategoryService } from './question-category.service';
import { QuestionCategoryResolver } from './question-category.resolver';
import { getDataSourceToken, getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { QuestionCategory } from './entities/question-category.entity';
import { DataSource } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionCategory])],
  providers: [
    {
      provide: getRepositoryToken(QuestionCategory),
      inject: [getDataSourceToken()],
      useFactory(dataSource: DataSource) {
        return dataSource
          .getRepository(QuestionCategory)
      }
    }
    , QuestionCategoryResolver, QuestionCategoryService],
})
export class QuestionCategoryModule { }
