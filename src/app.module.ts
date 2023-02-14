import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AnswerModule } from './answer/answer.module';
import { QuestionModule } from './question/question.module';
import { SurveyModule } from './survey/survey.module';
import { ResponseModule } from './response/response.module';
import { ParticipantModule } from './participant/participant.module';
import { Survey } from './survey/entities/survey.entity';

@Module({
  imports: [Survey],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
