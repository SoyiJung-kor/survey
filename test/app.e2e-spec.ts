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
import { SurveyService } from '../src/survey/survey.service';

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
  describe('survey', () => {
    describe('create survey', () => {
      it('create success survey', async () => {
        return request(app.getHttpServer())
          .post(gql)
          .send({
            query: `
          mutation {
            createSurvey(createSurveyInput:{surveyTitle:"Test Survey"}) {
              id
              surveyTitle
            }
          }
          `,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.createSurvey.id).toBe(1);
            expect(res.body.data.createSurvey.surveyTitle).toBe('Test Survey');
          });
      });
      it('create fail survey', async () => {
        return request(app.getHttpServer())
          .post(gql)
          .send({
            query: `
          mutation createSurvey {
            createSurvey() {
              id
              surveyTitle
            }
          }
          `,
          })
          .expect(400);
      });
    });
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
      it('fail find all surveys', async () => {
        const result = request(app.getHttpServer())
          .post(gql)
          .send({
            query: `{
            findAllSurveys{
              id
              survey
            }
          }`,
          })
          .expect(400);
        return result;
      });
    });
    describe('find a survey', () => {
      it('find a survey', async () => {
        return request(app.getHttpServer())
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
          .expect((res) => {
            expect(res.body.data.findSurvey.id).toBe(1);
          });
      });
    });
    describe('update a survey', () => {
      it('update survey', async () => {
        return request(app.getHttpServer())
          .post(gql)
          .send({
            query: `
          mutation updateSurvey {
            updateSurvey(updateSurveyInput:{surveyTitle:"Modified Survey",id:1}) {
              id
              surveyTitle
            }
          }
          `,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.updateSurvey.id).toBe(1);
            expect(res.body.data.updateSurvey.surveyTitle).toBe(
              'Modified Survey',
            );
          });
      });
    });
    describe('remove a survey', () => {
      it('remove survey', async () => {
        return request(app.getHttpServer())
          .post(gql)
          .send({
            query: `
          mutation removeSurvey {
            removeSurvey(surveyId:1) {
              id
              surveyTitle
            }
          }
          `,
          })
          .expect(200);
      });
      it('remove survey', async () => {
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
          .expect((res) => {
            expect(res.body.data.findAllSurveys).toHaveLength(0);
          })
          .expect(200);
        return result;
      });
    });
  });
  describe('question', () => {
    beforeAll(async () => {
      const survey = dataSource.manager.create(Survey, {
        surveyTitle: 'test Survey',
      });
      dataSource.manager.save(survey);
    });
    describe('create question', () => {
      it('create success question', async () => {
        return request(app.getHttpServer())
          .post(gql)
          .send({
            query: `
          mutation {
            createQuestion(createQuestionInput:{questionNumber:1,questionContent:"Test Question",surveyId:2}) {
              id
              questionNumber
              questionContent
              surveyId
            }
          }
          `,
          })
          .expect(200)
          .expect((res) => {
            console.log(res);
            expect(res.body.data.createQuestion.id).toBe(1);
            expect(res.body.data.createQuestion.questionNumber).toBe(1);
            expect(res.body.data.createQuestion.questionContent).toBe(
              'Test Question',
            );
            expect(res.body.data.createQuestion.surveyId).toBe(2);
          });
      });
      it('create fail survey', async () => {
        return request(app.getHttpServer())
          .post(gql)
          .send({
            query: `
          mutation createSurvey {
            createSurvey() {
              id
              surveyTitle
            }
          }
          `,
          })
          .expect(400);
      });
    });
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
      it('fail find all surveys', async () => {
        const result = request(app.getHttpServer())
          .post(gql)
          .send({
            query: `{
            findAllSurveys{
              id
              survey
            }
          }`,
          })
          .expect(400);
        return result;
      });
    });
    describe('find a survey', () => {
      it('find a survey', async () => {
        return request(app.getHttpServer())
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
          .expect((res) => {
            expect(res.body.data.findSurvey.id).toBe(1);
          });
      });
    });
    describe('update a survey', () => {
      it('update survey', async () => {
        return request(app.getHttpServer())
          .post(gql)
          .send({
            query: `
          mutation updateSurvey {
            updateSurvey(updateSurveyInput:{surveyTitle:"Modified Survey",id:1}) {
              id
              surveyTitle
            }
          }
          `,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.updateSurvey.id).toBe(1);
            expect(res.body.data.updateSurvey.surveyTitle).toBe(
              'Modified Survey',
            );
          });
      });
    });
    describe('remove a survey', () => {
      it('remove survey', async () => {
        return request(app.getHttpServer())
          .post(gql)
          .send({
            query: `
          mutation removeSurvey {
            removeSurvey(surveyId:1) {
              id
              surveyTitle
            }
          }
          `,
          })
          .expect(200);
      });
      it('remove survey', async () => {
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
          .expect((res) => {
            expect(res.body.data.findAllSurveys).toHaveLength(0);
          })
          .expect(200);
        return result;
      });
    });
  });
  it.todo('Answer');
  it.todo('User');
  it.todo('Response');
  it.todo('EachResponse');
});
