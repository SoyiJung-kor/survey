import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionResolver } from './question.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswerModule } from '../answer/answer.module';
import { Question } from './entities/question.entity';
import { QuestionCategory } from '../question-category/entities/question-category.entity';

@Module({
  imports: [
    AnswerModule,
    QuestionCategory,
    TypeOrmModule.forFeature([Question]),
  ],
  providers: [QuestionResolver, QuestionService],
})
// eslint-disable-next-line prettier/prettier
export class QuestionModule { }
