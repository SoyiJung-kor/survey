import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionResolver } from './question.resolver';
import { Answer } from '../answer/entities/answer.entity';

@Module({
  imports: [Answer],
  providers: [QuestionResolver, QuestionService]
})
export class QuestionModule {}
