import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Survey } from '../src/survey/entities/survey.entity';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { Answer } from '../src/answer/entities/answer.entity';
import { EachResponse } from '../src/each-response/entities/each-response.entity';
import { Participant } from '../src/participant/entities/participant.entity';
import { ParticipantModule } from '../src/participant/participant.module';
import { Question } from '../src/question/entities/question.entity';
import { SurveyModule } from '../src/survey/survey.module';
import request from 'supertest';
import { Response } from '../src/response/entities/response.entity';
import { DataSource } from 'typeorm';

const gql = '/graphql';

describe('Graphql (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        SurveyModule,
        ParticipantModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: 'postgres',
          database: 'test',
          entities: [
            Answer,
            Participant,
            Question,
            Response,
            Survey,
            EachResponse,
          ],
          synchronize: true,
        }),
        GraphQLModule.forRoot<ApolloDriverConfig>({
          driver: ApolloDriver,
          autoSchemaFile: join(process.cwd(), 'test/schema.gql'),
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    dataSource = moduleFixture.get<DataSource>(DataSource);
    dataSource.manager.insert(Survey, { surveyTitle: 'Test Survey #1' });
  });
  it('be define', async () => {
    expect(app).toBeDefined;
    expect(dataSource).toBeDefined;
  });

  afterAll(async () => {
    await dataSource.dropDatabase();
    app.close();
  });
  describe('survey', () => {
    describe('find all survey', () => {
      it('find all surveys', async () => {
        const result = request(app.getHttpServer())
          .post(gql)
          .send({
            query: `{
            findAllSurveys{
              id
              surveyTitle
            }
          }`,
          })
          .expect(200);
        return result;
      });
    });
    describe('create survey', () => {
      it('create survey', async () => {
        request(app.getHttpServer())
          .post(gql)
          .send({
            query: `
          mutation createSurvey {
            createSurvey(createSurveyInput:{surveyTitle:"Test Survey"}) {
              id
              surveyTitle
            }
          }
          `,
          })
          .expect(200)
          .expect('surveyTitle', 'Test Survey');
      });
    });
    describe('find a survey', () => {
      it('find a survey', async () => {
        request(app.getHttpServer())
          .post(gql)
          .send({
            query: `{
            findSurvey(surveyId:1){
              id
              surveyTitle
            }
          }`,
          })
          .expect(200)
          .expect('surveyTitle', 'Test Survey')
          .expect('id', '1');
      });
    });
    describe('update a survey', () => {
      it.todo('update a survey');
    });
    describe('remove a survey', () => {
      it.todo('remove a survey');
    });
  });
});
it.todo('Question');
it.todo('Answer');
it.todo('User');
it.todo('Response');
it.todo('EachResponse');
