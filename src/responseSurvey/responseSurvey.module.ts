import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DateScalar } from '../common/scalars/date.scalar';
import { ResponseModule } from '../response/response.module';
import { ResponseSurvey } from './entities/ResponseSurvey.entity';
import { ResponseSurveyResolver } from './ResponseSurvey.resolver';
import { ResponseSurveyService } from './ResponseSurvey.survice';

@Module({
  imports: [
    SurveyModule,
    ResponseModule,
    TypeOrmModule.forFeature([ResponseSurvey]),
  ],
  providers: [ResponseSurveyResolver, ResponseSurveyService, DateScalar],
  exports: [TypeOrmModule],
})
export class SurveyModule {}
