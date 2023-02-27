/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { typeORMConfig } from '../src/common/config/orm-config';
import { ParticipantModule } from '../src/participant/participant.module';
import { SurveyModule } from '../src/survey/survey.module';
import { HttpExceptionFilter } from '../src/common/utils/http_exception_filter';
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
        app.useGlobalFilters(new HttpExceptionFilter());
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
        dataSource = moduleFixture.get<DataSource>(DataSource);
    });

    afterAll(async () => {
        await dataSource.dropDatabase();
        app.close();
    });

    describe('설문지 만들기!', () => {
        it('설문지 만들기 성공!', async () => {
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
        it('설문을 만들 때, input이 없으면 실패한다.', async () => {
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
        it('설문지 제목이 너무 짧아서 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
          mutation {
            createSurvey(createSurveyInput:{surveyTitle:"l"}) {
              id
              surveyTitle
            }
          }
          `,
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body.data).toBeNull();
                });
        });
    });
    describe('모든 설문 조회하기!', () => {
        it('모든 설문 조회 성공!', async () => {
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
        it('잘못된 query field를 요청해서 설문 조회 실패!', async () => {
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
    describe('단일 설문 조회!', () => {
        it('단일 설문 조회 성공!', async () => {
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
                    expect(res.body.data.findSurvey.surveyTitle).toBe('Test Survey');
                });
        });
        it.todo('존재하지 않는 설문 아이디를 입력해서 조회 실패!')
        it.todo('잘못된 query field를 입력해서 조회 실패!')
    });
    describe('설문 수정하기!', () => {
        it('설문 수정 성공!', async () => {
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
        it.todo('잘못된 인풋때문에 설문 수정 실패!')
    });
    describe('설문 삭제하기!', () => {
        it('설문 삭제 성공!', async () => {
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
        it('설문을 삭제하면 디비에 남은 데이터가 없다.', async () => {
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
