import { Module } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { SurveyResolver } from './survey.resolver';

@Module({
  providers: [SurveyResolver, SurveyService]
})
export class SurveyModule {}
