import { Module, Response } from '@nestjs/common';
import { ResponseService } from './response.service';
import { ResponseResolver } from './response.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseSurveyModule } from '../responseSurvey/responseSurvey.module';
import { ResponseQuestionModule } from '../responseQuestion/response-question.module';
import { ResponseAnswerModule } from '../responseAnswer/responseAnswer.module';

@Module({
  imports: [
    ResponseSurveyModule,
    ResponseQuestionModule,
    ResponseAnswerModule,
    TypeOrmModule.forFeature([Response]),
  ],
  providers: [ResponseResolver, ResponseService],
  exports: [TypeOrmModule],
})
export class ResponseModule {}
