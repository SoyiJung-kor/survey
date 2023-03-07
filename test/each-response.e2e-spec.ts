/* eslint-disable prettier/prettier */
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TestingModule, Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { ParticipantModule } from '../src/participant/participant.module';
import { SurveyModule } from '../src/survey/survey.module';
const gql = '/graphql';
import request from 'supertest';
import { Answer } from '../src/answer/entities/answer.entity';
import { Participant } from '../src/participant/entities/participant.entity';
import { Question } from '../src/question/entities/question.entity';
import { Survey } from '../src/survey/entities/survey.entity';
import { Response } from '../src/response/entities/response.entity';
import { HttpExceptionFilter } from '../src/common/utils/http_exception_filter';
import { testTypeORMConfig } from '../src/common/config/test-orm-config';
describe('eachResponse', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        SurveyModule,
        ParticipantModule,
        TypeOrmModule.forRoot(testTypeORMConfig),
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
    // app.close();
  });
  describe('응답항목 생성', () => {
    it('응답항목생성성공!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            mutation {
              createEachResponse(input:{responseId:1,responseQuestion:"Modified Question",responseAnswer:"Modified Answer", responseScore:5}) {
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
    it('인풋데이터를 입력하지 않아 응답항목생성실패!', async () => {
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
    it('존재하지 않는 응답 아이디를 입력해서 응답항목 생성 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            mutation {
              createEachResponse(input:{responseId:100,responseQuestion:"Modified Question",responseAnswer:"Modified Answer", responseScore:5}) {
                id
                responseId
                responseQuestion
                responseAnswer
                responseScore
              }
            }
            `,
        })
        .expect((res) => {
          expect(res.body.data).toBeNull();
        });
    });
  });
  describe('모든 응답 항목 조회!', () => {
    it('모든 응답 항목 조회 성공!', async () => {
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
    it('queryfield를 잘못 입력해서 모든 응답 항목 조회 실패!', async () => {
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
  describe('아이디로 응답 항목 조회!', () => {
    it('아이디로 응답 항목 조회 성공!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `{
              findEachResponse(id:1){
                id
                responseId
                responseQuestion
                responseAnswer
                responseScore
              }
            }`,
        })
        .expect((res) => {
          expect(res.body.data.findEachResponse.id).toBe(1);
          expect(res.body.data.findEachResponse.responseId).toBe(1);
          expect(res.body.data.findEachResponse.responseQuestion).toBe(
            'Modified Question',
          );
          expect(res.body.data.findEachResponse.responseAnswer).toBe(
            'Modified Answer',
          );
          expect(res.body.data.findEachResponse.responseScore).toBe(5);
        });
    });
    it('존재하지 않는 아이디를 입력해서 응답 항목 조회 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `{
              findEachResponse(id:100){
                id
                responseId
                responseQuestion
                responseAnswer
                responseScore
              }
            }`,
        })
        .expect((res) => {
          expect(res.body.data).toBeNull();
        });
    });
    it('아이디를 입력하지 않아 응답 항목 조회 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `{
              findEachResponse(id:){
                id
                responseId
                responseQuestion
                responseAnswer
                responseScore
              }
            }`,
        })
        .expect(400);
    });
    it('query field를 잘못 입력해서 응답 항목 조회 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `{
              findEachResponse(id:1){
              }
            }`,
        })
        .expect(400);
    });
  });
  describe('응답항목 수정!', () => {
    it('응답항목 수정 성공!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            mutation {
              updateEachResponse(input:{id:1}) {
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
    it('존재하지 않는 아이디를 입력해서 응답항목 수정 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            mutation {
              updateEachResponse(input:{id:100}) {
                id
                responseId
              }
            }
            `,
        })
        .expect((res) => {
          expect(res.body.data).toBeNull();
        });
    });
    it('아이디를 입력하지 않아 응답항목 수정 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            mutation {
              updateEachResponse(input:{id:}) {
                id
                responseId
              }
            }
            `,
        })
        .expect(400);
    });
    it('존재하지 않는 응답아이디를 인풋으로 입력해서 응답항목 수정 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            mutation {
              updateEachResponse(input:{id:1,responseId:100}) {
                id
                responseId
              }
            }
            `,
        })
        .expect((res) => {
          expect(res.body.data).toBeNull();
        })
    });
    it('인풋데이터를 입력하지 않아 응답항목 수정 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            mutation {
              updateEachResponse() {
                id
                responseId
              }
            }
            `,
        })
        .expect(400);
    });
    it('인풋데이터 형식이 잘못되어 응답항목 수정 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            mutation {
              updateEachResponse(input:{ids:1}) {
                id
                responseId
              }
            }
            `,
        })
        .expect(400);
    });
    it('query field를 잘못 입력해서 응답항목 수정 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            mutation {
              updateEachResponse(input:{id:1}) {
              }
            }
            `,
        })
        .expect(400);
    });
  });
  describe('응답항목 삭제!', () => {
    it('응답항목 삭제 성공!', async () => {
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
    it('응답항목 삭제 성공!', async () => {
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
    it('존재하지 않는 아이디를 입력해서 응답항목 삭제 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
              mutation removeEachResponse {
                removeEachResponse(id:100) {
                  id
                }
              }
              `,
        })
        .expect(200);
    });
    it('아이디를 입력하지 않아 응답항목 삭제 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
              mutation removeEachResponse {
                removeEachResponse(id:) {
                  id
                }
              }
              `,
        })
        .expect(400);
    });
  });
});