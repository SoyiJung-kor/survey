import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionResolver } from './question.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswerModule } from '../answer/answer.module';
import { Question } from './entities/question.entity';
import { QuestionCategoryModule } from '../question-category/question-category.module';

@Module({
  imports: [
    AnswerModule,
    QuestionCategoryModule,
    TypeOrmModule.forFeature([Question]),
  ],
  providers: [QuestionResolver, QuestionService],
})
// eslint-disable-next-line prettier/prettier
export class QuestionModule { }
