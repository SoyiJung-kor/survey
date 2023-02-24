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
import { Answer } from '../src/answer/entities/answer.entity';
import { Participant } from '../src/participant/entities/participant.entity';
import { Question } from '../src/question/entities/question.entity';
import { Survey } from '../src/survey/entities/survey.entity';
import { Response } from '../src/response/entities/response.entity';
describe('eachResponse', () => {
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

        const mockResponse = new Response();
        mockResponse.surveyId = 1;
        mockResponse.participantId = 1;
        mockResponse.survey = mockSurvey;
        mockResponse.participant = mockParticipant;
        await dataSource.manager.save(mockResponse);

    });

    afterAll(async () => {
        await dataSource.dropDatabase();
        app.close();
    });
    describe('create each response', () => {
        it('create success each response', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
            mutation {
              createEachResponse(createEachResponseInput:{responseId:1,responseQuestion:"Modified Question",responseAnswer:"Modified Answer", responseScore:5}) {
                id
                responseId
                responseQuestion
                responseAnswer
                responseScore
              }
            }
            `,
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body.data.createEachResponse.id).toBe(1);
                    expect(res.body.data.createEachResponse.responseId).toBe(1);
                    expect(res.body.data.createEachResponse.responseQuestion).toBe(
                        'Modified Question',
                    );
                    expect(res.body.data.createEachResponse.responseAnswer).toBe(
                        'Modified Answer',
                    );
                    expect(res.body.data.createEachResponse.responseScore).toBe(5);
                });
        });
        it('create fail each response', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
            mutation createEachResponse {
              createEachResponse() {
                id
                responseId
                responseQuestion
                responseAnswer
                responseScore
              }
            }
            `,
                })
                .expect(400);
        });
    });
    describe('find all each response', () => {
        it('find all each response', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `{
              findAllEachResponse{
                id
                responseId
                responseQuestion
                responseAnswer
                responseScore
              }
            }`,
                })
                .expect(200);
        });
        it('fail find all each response', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `{
              findAllEachResponse{
                id
                eachResponse
              }
            }`,
                })
                .expect(400);
        });
    });
    describe('find a each response', () => {
        it('find a each response', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `{
              findOneEachResponse(id:1){
                id
                responseId
                responseQuestion
                responseAnswer
                responseScore
              }
            }`,
                })
                .expect((res) => {
                    expect(res.body.data.findOneEachResponse.id).toBe(1);
                    expect(res.body.data.findOneEachResponse.responseId).toBe(1);
                    expect(res.body.data.findOneEachResponse.responseQuestion).toBe(
                        'Modified Question',
                    );
                    expect(res.body.data.findOneEachResponse.responseAnswer).toBe(
                        'Modified Answer',
                    );
                    expect(res.body.data.findOneEachResponse.responseScore).toBe(5);
                });
        });
    });
    describe('update a each response', () => {
        it('update each response', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
            mutation {
              updateEachResponse(updateEachResponseInput:{id:1}) {
                id
                responseId
              }
            }
            `,
                })
                .expect((res) => {
                    expect(res.body.data.updateEachResponse.id).toBe(1);
                    expect(res.body.data.updateEachResponse.responseId).toBe(1);
                });
        });
    });
    describe('remove a each response', () => {
        it('remove each response', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
              mutation removeEachResponse {
                removeEachResponse(id:1) {
                  id
                }
              }
              `,
                })
                .expect(200);
        });
        it('remove each response', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `{
                findAllEachResponse{
                  id
                }
              }`,
                })
                .expect((res) => {
                    expect(res.body.data.findAllEachResponse).toHaveLength(0);
                })
                .expect(200);
        });
    });
});