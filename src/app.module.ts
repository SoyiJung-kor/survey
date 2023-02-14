import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Survey } from './survey/entities/survey.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from './answer/entities/answer.entity';
import { Participant } from './participant/entities/participant.entity';
import { Question } from './question/entities/question.entity';
import { Response } from './response/entities/response.entity';

@Module({
  imports: [
    Survey,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [Answer, Participant, Question, Response, Survey],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
