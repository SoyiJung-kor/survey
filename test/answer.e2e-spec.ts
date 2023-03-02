/* eslint-disable prettier/prettier */
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TestingModule, Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { testTypeORMConfig } from '../src/common/config/test-orm-config';
import { ParticipantModule } from '../src/participant/participant.module';
import { Survey } from '../src/survey/entities/survey.entity';
import { SurveyModule } from '../src/survey/survey.module';
const gql = '/graphql';
import request from 'supertest';
import { Question } from '../src/question/entities/question.entity';
import { HttpExceptionFilter } from '../src/common/utils/http_exception_filter';

describe('answer', () => {
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

  });

  afterAll(async () => {
    await dataSource.dropDatabase();
    app.close();
  });
  describe('답지 생성', () => {
    it('답지생성 성공!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            mutation {
              createAnswer(createAnswerInput:{answerNumber:1,answerContent:"Test Answer",answerScore:5, questionId:1}) {
                id
                answerNumber
                answerContent
                question{
                  id
                  questionContent
                }
              }
            }
            `,
        })
        .expect(200)
        .expect((res) => {
          const createAnswer = res.body.data.createAnswer
          const { id, answerNumber, answerContent, question } = createAnswer;

          expect(id).toBe(1);
          expect(answerNumber).toBe(1);
          expect(answerContent).toBe('Test Answer');
          expect(question.id).toBe(1);
          expect(question.questionContent).toBe(
            'Mock Question for Test',
          );
        });
    });
    it('인풋데이터가 없어서 답지 생성 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            mutation createAnswer {
              createAnswer() {
                id
                answerContent
                answerNumber
                question{
                  id
                  questionContent
                }
              }
            }
            `,
        })
        .expect(400);
    });
    it('답지 번호가 숫자가 아니라서 답지 생성 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            mutation {
              createAnswer(createAnswerInput:{answerNumber:"1",answerContent:"Test Answer",answerScore:5, questionId:1}) {
                id
                answerNumber
                answerContent
                question{
                  id
                  questionContent
                }
              }
            }
            `,
        })
        .expect(400);
    });
    it('답지 번호가 없어서 답지 생성 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            mutation {
              createAnswer(createAnswerInput:{answerContent:" ",answerScore:5, questionId:1}) {
                id
                answerNumber
                answerContent
                question{
                  id
                  questionContent
                }
              }
            }
            `,
        })
        .expect(400);
    });
    it('답지 내용이 없어서 답지 생성 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            mutation {
              createAnswer(createAnswerInput:{answerNumber:1,answerScore:5, questionId:1}) {
                id
                answerNumber
                answerContent
                question{
                  id
                  questionContent
                }
              }
            }
            `,
        })
        .expect(400);
    });
    it('답지 내용이 너무 짧아서 답지 생성 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            mutation {
              createAnswer(createAnswerInput:{answerNumber:1,answerContent:" ",answerScore:5, questionId:1}) {
                id
                answerNumber
                answerContent
                question{
                  id
                  questionContent
                }
              }
            }
            `,
        })
        .expect((res) => {
          expect(res.body.data).toBeNull();
        })
    });
    it('답지 점수가 숫자가 아니라서 답지 생성 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            mutation {
              createAnswer(createAnswerInput:{answerNumber:1,answerContent:"Test Answer",answerScore:"5", questionId:1}) {
                id
                answerNumber
                answerContent
                question{
                  id
                  questionContent
                }
              }
            }
            `,
        })
        .expect(400);
    });
    it('답지 점수가 없어서 답지 생성 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            mutation {
              createAnswer(createAnswerInput:{answerNumber:1,answerContent:"Test Answer", questionId:1}) {
                id
                answerNumber
                answerContent
                question{
                  id
                  questionContent
                }
              }
            }
            `,
        })
        .expect(400);
    });
    it('질문 아이디를 입력하지 않아서 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            mutation {
              createAnswer(createAnswerInput:{answerNumber:1,answerContent:"Test Answer",answerScore:5}) {
                id
                answerNumber
                answerContent
                question{
                  id
                  questionContent
                }
              }
            }
            `,
        })
        .expect(400);
    });
    it('없는 질문 아이디를 입력해서 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            mutation {
              createAnswer(createAnswerInput:{answerNumber:1,answerContent:"Test Answer",answerScore:5, questionId:100}) {
                id
                answerNumber
                answerContent
                question{
                  id
                  questionContent
                }
              }
            }
            `,
        })
        .expect((res) => {
          expect(res.body.data).toBeNull();
        })
    });
  });
  describe('전체 답지 조회', () => {
    it('전체 답지 조회 성공!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `{
              findAllAnswers{
                id
                answerNumber
                answerContent
              }
            }`,
        })
        .expect(200);
    });
    it('query field를 잘못 넣어서 전체 답지 조회 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `{
              findAllAnswers{
                id
                answer
              }
            }`,
        })
        .expect(400);
    });
  });
  describe('단일 답지 조회', () => {
    it('아이디로 단일 답지 조회 성공!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `{
              findAnswer(id:1){
                answerNumber
                answerContent
              }
            }`,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.findAnswer.answerNumber).toBe(1);
          expect(res.body.data.findAnswer.answerContent).toBe('Test Answer');
        });
    });
    it('없는 아이디를 입력해서 단일 답지 조회 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `{
              findAnswer(id:100){
                answerNumber
                answerContent
              }
            }`,
        })
        .expect((res) => {
          expect(res.body.data).toBeNull();
        });
    });
    it('잘못된 query field로 인해 단일 답지 조회 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `{
              findAnswer(answerId:1){
                answerNumber
                answer
              }
            }`,
        })
        .expect(400);
    });
    it('답지 상세조회 성공!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `{
              findOneAnswerDetail(answerId:1){
                answerNumber
                answerContent
              }
            }`,
        })
        .expect(200);
    });
    it('없는 아이디를 입력해서 답지 상세조회 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `{
              findOneAnswerDetail(answerId:100){
                answerNumber
                answerContent
              }
            }`,
        })
        .expect((res) => {
          expect(res.body.data).toBeNull();
        })
    });
    it('잘못된 query field를 입력해서 답지 상세조회 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `{
              findOneAnswerDetail(answerId:1){
                answerNumber
                answer
              }
            }`,
        })
        .expect(400);
    });
  });
  describe('update a answer', () => {
    it('질문 수정 성공!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            mutation updateAnswer {
              updateAnswer(updateAnswerInput:{answerContent:"Modified Answer",id:1}) {
                id
                answerContent
              }
            }
            `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.updateAnswer.id).toBe(1);
          expect(res.body.data.updateAnswer.answerContent).toBe(
            'Modified Answer',
          );
        });
    });
    it('없는 답지 아이디를 입력해서 수정 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            mutation updateAnswer {
              updateAnswer(updateAnswerInput:{answerContent:"Modified Answer",id:100}) {
                id
                answerContent
              }
            }
            `,
        })
        .expect((res) => {
          expect(res.body.data).toBeNull();
        });
    });
    it('query field를 잘못 입력해서 수정 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            mutation updateAnswer {
              updateAnswer(updateAnswerInput:{answerContent:"Modified Answer",id:1}) {
                id
                answer
              }
            }
            `,
        })
        .expect(400);
    });
    it('답지 번호가 숫자가 아니라 수정 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            mutation updateAnswer {
              updateAnswer(updateAnswerInput:{answerNumber:"1",id:1}) {
                id
                answerContent
              }
            }
            `,
        })
        .expect(400);
    });
    it('답지 내용이 너무 짧아서 수정 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            mutation updateAnswer {
              updateAnswer(updateAnswerInput:{answerContent:" ",id:1}) {
                id
                answerContent
              }
            }
            `,
        })
        .expect((res) => {
          expect(res.body.data).toBeNull();
        });
    });
    it('질문 아이디가 유효하지 않아 수정 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            mutation updateAnswer {
              updateAnswer(updateAnswerInput:{questionId:100,id:1}) {
                id
                answerContent
              }
            }
            `,
        })
        .expect((res) => {
          expect(res.body.data).toBeNull();
        });
    });

  });
  describe('remove a answer', () => {
    it('remove answer', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation removeAnswer {
            removeAnswer(id:1) {
              id
            }
          }
          `,
        })
        .expect(200);
    });
    it('remove answer', async () => {
      const result = request(app.getHttpServer())
        .post(gql)
        .send({
          query: `{
            findAllAnswers{
              id
            }
          }`,
        })
        .expect((res) => {
          expect(res.body.data.findAllAnswers).toHaveLength(0);
        })
        .expect(200);
      return result;
    });
    it('답지 아이디가 없어 삭제 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation removeAnswer {
            removeAnswer(id:100) {
              id
            }
          }
          `,
        })
        .expect((res) => {
          expect(res.body.data).toBeNull();
        })
    });
  });
});
