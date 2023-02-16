import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DateScalar } from '../common/scalars/date.scalar';
import { ResponseModule } from '../response/response.module';
import { PickedSurvey } from './entities/pickedSurvey.entity';
import { PickedSurveyResolver } from './pickedSurvey.resolver';
import { PickedSurveyService } from './pickedSurvey.survice';

@Module({
  imports: [
    SurveyModule,
    ResponseModule,
    TypeOrmModule.forFeature([PickedSurvey]),
  ],
  providers: [PickedSurveyResolver, PickedSurveyService, DateScalar],
  exports: [TypeOrmModule],
})
export class SurveyModule {}
