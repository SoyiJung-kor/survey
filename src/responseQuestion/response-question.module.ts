import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseQuestion } from './entities/response-question.entity';
import { ResponseQuestionResolver } from './response-question.resolver';
import { ResponseQuestionService } from './response-question.service';

@Module({
  imports: [TypeOrmModule.forFeature([ResponseQuestion])],
  providers: [ResponseQuestionResolver, ResponseQuestionService],
  exports: [TypeOrmModule],
})
export class ResponseQuestionModule {}
