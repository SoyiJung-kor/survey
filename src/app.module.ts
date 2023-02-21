import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { Survey } from "./survey/entities/survey.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Answer } from "./answer/entities/answer.entity";
import { Participant } from "./participant/entities/participant.entity";
import { Question } from "./question/entities/question.entity";
import { Response } from "./response/entities/response.entity";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { join } from "path";
import { SurveyModule } from "./survey/survey.module";
import { DataSource } from "typeorm";
import { ParticipantModule } from "./participant/participant.module";
import { EachResponse } from "./each-response/entities/each-response.entity";

@Module({
  imports: [
    SurveyModule,
    ParticipantModule,
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "postgres",
      database: "postgres2",
      entities: [Answer, Participant, Question, Response, Survey, EachResponse],
      synchronize: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
