import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionModule } from '../question/question.module';
import { ResponseModule } from '../response/response.module';
import { ResponseQuestion } from './entities/response-question.entity';
import { ResponseQuestionResolver } from './response-question.resolver';
import { ResponseQuestionService } from './response-question.service';

@Module({
  imports: [
    ResponseModule,
    QuestionModule,
    TypeOrmModule.forFeature([ResponseQuestion]),
  ],
  providers: [ResponseQuestionResolver, ResponseQuestionService],
  exports: [TypeOrmModule],
})
export class ResponseQuestionModule {}
