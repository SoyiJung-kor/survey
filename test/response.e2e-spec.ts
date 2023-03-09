
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
import { Question } from '../src/question/entities/question.entity';
import { Survey } from '../src/survey/entities/survey.entity';
import { Answer } from '../src/answer/entities/answer.entity';
import { Participant } from '../src/participant/entities/participant.entity';
import { HttpExceptionFilter } from '../src/common/utils/http_exception_filter';
import { testTypeORMConfig } from '../src/common/config/test-orm-config';

describe('response', () => {
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

  });

  afterAll(async () => {
    await dataSource.dropDatabase();
    app.close();
  });

  describe('응답 생성', () => {
    it('응답 생성 성공!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            mutation {
              createResponse(input:{surveyId:1,participantId:1}) {
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
    it('인풋데이터가 없어서 응답 생성 실패!', async () => {
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
    it('존재하지 않는 참가자 아이디를 입력해서 응답 생성 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            mutation {
              createResponse(input:{surveyId:1,participantId:100}) {
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
        .expect((res) => {
          expect(res.body.data).toBeNull();
        });
    });
    it('참가자 아이디를 입력하지 않아 응답 생성 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            mutation {
              createResponse(input:{surveyId:1,participantId:}) {
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
    it('존재하지 않는 설문 아이디를 입력해서 응답 생성 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            mutation {
              createResponse(input:{surveyId:100,participantId:1}) {
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
        .expect((res) => {
          expect(res.body.data).toBeNull();
        });
    });
    it('설문 아이디를 입력하지 않아 응답 생성 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            mutation {
              createResponse(input:{surveyId:,participantId:1}) {
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
  describe('응답 전체 조회!', () => {
    it('응답 전체 조회 성공!', async () => {
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
    it('query field 잘못 넣어서 응답 조회 실패!', async () => {
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
  describe('응답 조회!', () => {
    it('아이디로 단일 응답 조회 성공!', async () => {
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
    it('존재하지 않는 아이디를 입력해서 응답 조회 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `{
              findResponse(responseId:100){
                id
                isSubmit
                sumScore
              }
            }`,
        })
        .expect((res) => {
          expect(res.body.data).toBeNull();
        });
    });
    it('아이디를 입력하지 않아 응답 조회 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `{
              findResponse(responseId:){
                id
                isSubmit
                sumScore
              }
            }`,
        })
        .expect(400);
    });
    it('query field를 잘못 넣어 응답 조회 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `{
              findResponse(responseId:1){
              }
            }`,
        })
        .expect(400);
    });
    it('응답 상세 조회 성공!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `{
              findOneResponseDetail(responseId:1){
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
    it('응답 아이디가 존재하지 않아 상세 응답 조회 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `{
              findOneResponseDetail(responseId:100){
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
          expect(res.body.data).toBeNull();
        });
    });
    it('응답 아이디를 입력하지 않아 상세 응답 조회 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `{
              findOneResponseDetail(responseId:){
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
        .expect(400);
    });
    it('query field를 잘못 넣어 상세 응답 조회 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `{
              findOneResponseDetail(responseId:1){
              }
            }`,
        })
        .expect(400);
    });
  });
  describe('응답 수정!', () => {
    it('응답 수정 성공!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            mutation {
              updateResponse(input:{id:1,isSubmit:true}) {
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
    it('존재하지 않는 아이디를 입력해서 응답 수정 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            mutation {
              updateResponse(input:{id:100,isSubmit:true}) {
                id
                isSubmit
              }
            }
            `,
        })
        .expect((res) => {
          expect(res.body.data).toBeNull();
        });
    });
    it('아이디를 입력하지 않아 응답 수정 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            mutation {
              updateResponse(input:{id:,isSubmit:true}) {
                id
                isSubmit
              }
            }
            `,
        })
        .expect(400);
    });
    it('input data가 없어 응답 수정 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            mutation {
              updateResponse() {
                id
                isSubmit
              }
            }
            `,
        })
        .expect(400);
    });
    it('input data 형식이 잘못되어 응답 수정 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            mutation {
              updateResponse(input:{id:1,isSubmite:true}) {
                id
                isSubmit
              }
            }
            `,
        })
        .expect(400);
    });
  });
  describe('응답 삭제!', () => {
    it('응답 삭제성공!', async () => {
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
    it('응답 삭제 성공!', async () => {
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
  it('존재하지 않는 응답 아이디를 입력해서 응답 삭제실패!', async () => {
    return request(app.getHttpServer())
      .post(gql)
      .send({
        query: `
            mutation removeResponse {
              removeResponse(responseId:100) {
                id
              }
            }
            `,
      })
      .expect((res) => {
        expect(res.body.data).toBeNull();
      })
  });
  it('응답 아이디를 입력하지 않아 응답 삭제실패!', async () => {
    return request(app.getHttpServer())
      .post(gql)
      .send({
        query: `
            mutation removeResponse {
              removeResponse(responseId:) {
                id
              }
            }
            `,
      })
      .expect(400);
  });
  it('query field가 잘못되어 응답 삭제 실패!', async () => {
    return request(app.getHttpServer())
      .post(gql)
      .send({
        query: `
            mutation removeResponse {
              removeResponse(responseId:1) {
              }
            }
            `,
      })
      .expect(400);
  });
});