/* eslint-disable prettier/prettier */
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { INestApplication } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TestingModule, Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { typeORMConfig } from '../src/common/config/orm-config';
import { ParticipantModule } from '../src/participant/participant.module';
import { SurveyModule } from '../src/survey/survey.module';
const gql = '/graphql';
import request from 'supertest';
import { Question } from '../src/question/entities/question.entity';
import { Survey } from '../src/survey/entities/survey.entity';
import { Answer } from '../src/answer/entities/answer.entity';
import { Participant } from '../src/participant/entities/participant.entity';

describe('response', () => {
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

        const mockSurvey = new Survey();
        mockSurvey.surveyTitle = 'Mock Survey for Test';
        await dataSource.manager.save(mockSurvey);

        const mockQuestion = new Question();
        mockQuestion.questionContent = 'Mock Question for Test';
        mockQuestion.surveyId = 1;
        mockQuestion.questionNumber = 1;
        mockQuestion.survey = mockSurvey;
        await dataSource.manager.save(mockQuestion);

        const mockAnswer = new Answer();
        mockAnswer.answerContent = 'Mock Answer for Test';
        mockAnswer.answerNumber = 1;
        mockAnswer.answerScore = 5;
        mockAnswer.questionId = 1;
        mockAnswer.question = mockQuestion;
        await dataSource.manager.save(mockAnswer);

        const mockParticipant = new Participant();
        mockParticipant.email = 'mock@test.com';
        await dataSource.manager.save(mockParticipant);

    });

    afterAll(async () => {
        await dataSource.dropDatabase();
        app.close();
    });

    describe('create response', () => {
        it('create success response', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
            mutation {
              createResponse(createResponseInput:{surveyId:1,participantId:1}) {
                id
                isSubmit
                sumScore
                participant{
                  id
                }
                survey{
                  id
                }
              }
            }
            `,
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body.data.createResponse.id).toBe(1);
                    expect(res.body.data.createResponse.isSubmit).toBe(false);
                    expect(res.body.data.createResponse.sumScore).toBe(0);
                    expect(res.body.data.createResponse.participant.id).toBe(1);
                    expect(res.body.data.createResponse.survey.id).toBe(1);
                });
        });
        it('create fail response', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
            mutation createResponse {
              createResponse() {
                id
                isSubmit
                sumScore
                participant{
                  id
                }
                survey{
                  id
                }
              }
            }
            `,
                })
                .expect(400);
        });
    });
    describe('find a response', () => {
        it('find all response', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `{
              findAllResponses{
                id
                isSubmit
                sumScore
                participant{
                  id
                }
                survey{
                  id
                }
              }
            }`,
                })
                .expect(200);
        });
        it('fail find all responses', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `{
              findAllResponses{
                id
                response
              }
            }`,
                })
                .expect(400);
        });
    });
    describe('find a response', () => {
        it('find a response', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `{
              findResponse(responseId:1){
                id
                isSubmit
                sumScore
              }
            }`,
                })
                .expect((res) => {
                    expect(res.body.data.findResponse.id).toBe(1);
                    expect(res.body.data.findResponse.isSubmit).toBe(false);
                    expect(res.body.data.findResponse.sumScore).toBe(0);
                });
        });
        it('fail find a detail response', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `{
              findResponse(responseId:1){
                id
                isSubmit
                sumScore
                participant{
                  id
                }
                survey{
                  id
                }
              }
            }`,
                })
                .expect((res) => {
                    expect(res.body.data).toBe(null);
                    // expect(res.body.data.findResponse.id).toBe(1);
                    // expect(res.body.data.findResponse.isSubmit).toBe(false);
                    // expect(res.body.data.findResponse.sumScore).toBe(0);
                    // expect(res.body.data.findResponse.participant.id).toBe(!1);
                    // expect(res.body.data.findResponse.survey.id).toBe(!1);
                });
        });
    });
    describe('update a response', () => {
        it('update response', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
            mutation {
              updateResponse(updateResponseInput:{id:1,isSubmit:true}) {
                id
                isSubmit
              }
            }
            `,
                })
                .expect((res) => {
                    expect(res.body.data.updateResponse.id).toBe(1);
                    expect(res.body.data.updateResponse.isSubmit).toBe(true);
                });
        });
    });
    describe('get a sumscore', () => {
        it('get a sumscore', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `{
              getSumScore(responseId:1){
                id
                isSubmit
                sumScore
              }
            }`,
                })
                .expect((res) => {
                    expect(res.body.data.getSumScore.id).toBe(1);
                    expect(res.body.data.getSumScore.isSubmit).toBe(true);
                    expect(res.body.data.getSumScore.sumScore).toBe(0);
                });
        });
    });
    describe('remove a response', () => {
        it('remove response', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
            mutation removeResponse {
              removeResponse(responseId:1) {
                id
              }
            }
            `,
                })
                .expect(200);
        });
        it('remove response', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `{
              findAllResponses{
                id
              }
            }`,
                })
                .expect((res) => {
                    expect(res.body.data.findAllResponses).toHaveLength(0);
                })
                .expect(200);
        });
    });
});