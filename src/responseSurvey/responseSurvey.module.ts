import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DateScalar } from '../common/scalars/date.scalar';
import { ResponseSurvey } from './entities/ResponseSurvey.entity';
import { ResponseSurveyResolver } from './ResponseSurvey.resolver';
import { ResponseSurveyService } from './ResponseSurvey.survice';

@Module({
  imports: [TypeOrmModule.forFeature([ResponseSurvey])],
  providers: [ResponseSurveyResolver, ResponseSurveyService, DateScalar],
  exports: [TypeOrmModule],
})
export class ResponseSurveyModule {}
