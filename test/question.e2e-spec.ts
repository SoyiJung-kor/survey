/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { Survey } from '../src/survey/entities/survey.entity';
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

describe('question', () => {
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

    console.log('question');
    const mockSurvey = new Survey();
    mockSurvey.id = 1;
    mockSurvey.surveyTitle = 'Mock Survey for Test';
    await dataSource.manager.save(Survey, mockSurvey);
  });


  afterAll(async () => {
    await dataSource.dropDatabase();
    app.close();
  });

  describe('질문 생성', () => {
    it('질문 생성 성공!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation {
            createQuestion(createQuestionInput:{questionNumber:1,questionContent:"Test Question",surveyId:1}) {
              id
              questionNumber
              questionContent
              survey{
                id
                surveyTitle
              }
            }
          }
          `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createQuestion.id).toBe(1);
          expect(res.body.data.createQuestion.questionNumber).toBe(1);
          expect(res.body.data.createQuestion.questionContent).toBe(
            'Test Question',
          );
          expect(res.body.data.createQuestion.survey.id).toBe(1);
          expect(res.body.data.createQuestion.survey.surveyTitle).toBe(
            'Mock Survey for Test',
          );
        });
    });
    it('인풋 데이터가 없어 질문 생성 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation createQuestion {
            createQuestion() {
              id
              questionContent
              questionNumber
              survey{
                id
                surveyTitle
              }
            }
          }
          `,
        })
        .expect(400);
    });
    it('질문 번호에 숫자가 아닌 문자를 입력하면 생성 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation {
            createQuestion(createQuestionInput:{questionNumber:"1",questionContent:"Test Question",surveyId:1}) {
              id
              questionNumber
              questionContent
              survey{
                id
                surveyTitle
              }
            }
          }
          `,
        })
        .expect(400);
    });
    it('질문 내용이 5글자 이하여서 생성 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation {
            createQuestion(createQuestionInput:{questionNumber:1,questionContent:" ",surveyId:1}) {
              id
              questionNumber
              questionContent
              survey{
                id
                surveyTitle
              }
            }
          }
          `,
        })
        .expect((res) => {
          expect(res.body.data).toBeNull();
        });

    });
    it('설문 아이디를 입력하지 않으면 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation {
            createQuestion(createQuestionInput:{questionNumber:1,questionContent:"Test Question",surveyId:}) {
              id
              questionNumber
              questionContent
              survey{
                id
                surveyTitle
              }
            }
          }
          `,
        })
        .expect(400);
    });
  });
  describe('전체 질문 조회!', () => {
    it('전체 질문 조회 성공!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `{
            findAllQuestions{
              id
              questionNumber
              questionContent
            }
          }`,
        })
        .expect(200);
    });
    it('query field가 잘못되어 조회 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `{
            findAllQuestions{
              id
              question
            }
          }`,
        })
        .expect(400);
    });
  });
  describe('특정 질문 조회!', () => {
    it('아이디로 특정 질문 조회 성공!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `{
            findQuestion(questionId:1){
              questionNumber
              questionContent
            }
          }`,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.findQuestion.questionNumber).toBe(1);
          expect(res.body.data.findQuestion.questionContent).toBe(
            'Test Question',
          );
        });
    });
    it('query field가 잘못되어 조회 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          query {
            findQuestion(questionId:1) {
              id
              questionNumber
              answer
            }
          }
          `,
        })
        .expect(400);
    });
    it('없는 id로 조회하면 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          query {
            findQuestion(questionId:100) {
              id
              questionNumber
              questionContent
            }
          }
          `,
        })
        .expect((res) => {
          console.log(res.body.data);
          expect(res.body.data).toBeNull();
        })
    });
    it('디테일한 특정 질문 조회 성공!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          query {
            findOneQuestionDetail(questionId:1) {
              id
              questionNumber
              questionContent
              survey{
                id
              }
            }
          }
          `,
        })
        .expect(200);
    });
    it('없는 id로 디테일한 특정 질문 조회 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          query {
            findOneQuestionDetail(questionId:100) {
              id
              questionNumber
              questionContent
              survey{
                id
              }
            }
          }
          `,
        })
        .expect((res) => {
          expect(res.body.data.findOneQuestionDetail).toStrictEqual([]);
        })
    });
    it('잘못된 query field때문에 디테일한 특정 질문 조회 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          query {
            findOneQuestionDetail(questionId:1) {
              id
              questionNumber
              questionContent
              survey{
              }
            }
          }
          `,
        })
        .expect(400);
    });
  });
  describe('질문 수정!', () => {
    it('질문 수정 성공!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation updateQuestion {
            updateQuestion(updateQuestionInput:{questionContent:"Modified Question",id:1}) {
              id
              questionContent
            }
          }
          `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.updateQuestion.id).toBe(1);
          expect(res.body.data.updateQuestion.questionContent).toBe(
            'Modified Question',
          );
        });
    });
    it('query field가 잘못되어 조회 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation updateQuestion {
            updateQuestion(updateQuestionInput:{questionContent:"Modified Question",id:1}) {
              id
              question
            }
          }
          `,
        })
        .expect(400);
    });
    it('없는 id로 조회하면 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation updateQuestion {
            updateQuestion(updateQuestionInput:{questionContent:"Modified Question",id:100}) {
              id
              questionContent
            }
          }
          `,
        })
        .expect((res) => {
          expect(res.body.data).toBeNull();
        })
    });
    it('질문 번호가 숫자가 아니어서 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation updateQuestion {
            updateQuestion(updateQuestionInput:{questionContent:"Modified Question",id:"1"}) {
              id
              questionContent
            }
          }
          `,
        })
        .expect(400);
    });
    it('질문 내용이 없어서 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation updateQuestion {
            updateQuestion(updateQuestionInput:{questionContent:" ",id:1}) {
              id
              questionContent
            }
          }
          `,
        })
        .expect((res) => {
          expect(res.body.data).toBeNull();
        })
    });
    it('없는 설문으로 수정하려면 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation updateQuestion {
            updateQuestion(updateQuestionInput:{id:100,questionContent:"Modified Question",surveyId:100}) {
              id
              questionContent
            }
          }
          `,
        })
        .expect((res) => {
          expect(res.body.data).toBeNull();
        });
    });
  });
  describe('질문 삭제!', () => {
    it('질문 삭제 성공!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation removeQuestion {
            removeQuestion(questionId:1) {
              id
            }
          }
          `,
        })
        .expect(200);
    });
    it('질문을 삭제하면 db에 남은 question data가 0개다.', async () => {
      const result = request(app.getHttpServer())
        .post(gql)
        .send({
          query: `{
            findAllQuestions{
              id
            }
          }`,
        })
        .expect((res) => {
          expect(res.body.data.findAllQuestions).toHaveLength(0);
        })
        .expect(200);
      return result;
    });
    it('query field가 잘못되어 삭제 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation removeQuestion {
            removeQuestion(questionId:1) {
              
            }
          }
          `,
        })
        .expect(400);
    });
    it('없는 id로 조회하면 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation removeQuestion {
            removeQuestion(questionId:100) {
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
