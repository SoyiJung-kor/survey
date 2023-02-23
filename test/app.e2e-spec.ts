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
import { DataSource, getConnection } from 'typeorm';

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
  });
  it('be define', async () => {
    expect(app).toBeDefined;
    expect(dataSource).toBeDefined;
  });

  afterAll(async () => {
    await dataSource.dropDatabase();
    app.close();
  });

  it.todo('createSurvey');

  describe('createSurvey', () => {
    it('find all survey', async () => {
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
      console.log(result);
      return result;
    });
    it('create survey', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation createSurvey {
            createSurvey(createSurveyInput:{surveyTitle:"Test Survey2"}) {
              id
              surveyTitle
            }
          }
          `,
        })
        .expect(200);
    });
  });
  it.todo('createQuestion');
  it.todo('createAnswer');
  it.todo('createUser');
  it.todo('createResponse');
  it.todo('createEachResponse');
});
