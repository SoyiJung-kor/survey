import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { SurveyModule } from './survey/survey.module';
import { ParticipantModule } from './participant/participant.module';
import { typeORMConfig } from './common/config/dev-orm-config';
import { CategoryScoreModule } from './category-score/category-score.module';
import { QuestionCategoryModule } from './question-category/question-category.module';

@Module({
  imports: [
    SurveyModule,
    ParticipantModule,
    TypeOrmModule.forRoot(typeORMConfig),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    CategoryScoreModule,
    QuestionCategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
// eslint-disable-next-line prettier/prettier
export class AppModule { }
