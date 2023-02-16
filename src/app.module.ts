import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Survey } from './survey/entities/survey.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from './answer/entities/answer.entity';
import { Participant } from './participant/entities/participant.entity';
import { Question } from './question/entities/question.entity';
import { Response } from './response/entities/response.entity';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { SurveyModule } from './survey/survey.module';
import { DataSource } from 'typeorm';
import { ResponseAnswer } from './ResponseAnswer/entities/ResponseAnswer.entity';
import { ResponseQuestion } from './responseQuestion/entities/response-question.entity';
import { ResponseSurvey } from './responseSurvey/entities/ResponseSurvey.entity';

@Module({
  imports: [
    SurveyModule,
    Participant,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [
        Answer,
        Participant,
        Question,
        Response,
        Survey,
        ResponseAnswer,
        ResponseSurvey,
        ResponseQuestion,
      ],
      synchronize: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
