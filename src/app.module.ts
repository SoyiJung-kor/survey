import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { SurveyModule } from './survey/survey.module';
import { ParticipantModule } from './participant/participant.module';
import { ConfigurationModule } from './common/config/config.module';
import { DatabaseModule } from './common/config/database.module';

@Module({
  imports: [
    SurveyModule,
    ParticipantModule,
    DatabaseModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    ConfigurationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }