/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { INestApplication } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { typeORMConfig } from '../src/common/config/orm-config';
import { ParticipantModule } from '../src/participant/participant.module';
import { SurveyModule } from '../src/survey/survey.module';
const gql = '/graphql';

describe('survey', () => {
    let app: INestApplication;
    let dataSource: DataSource;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                SurveyModule,
                ParticipantModule,
                TypeOrmModule.forRoot(typeORMConfig),
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

    afterAll(async () => {
        await dataSource.dropDatabase();
        app.close();
    });

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
