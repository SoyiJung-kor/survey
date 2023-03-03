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
import { ParticipantModule } from '../src/participant/participant.module';
import { SurveyModule } from '../src/survey/survey.module';
import { HttpExceptionFilter } from '../src/common/utils/http_exception_filter';
import { testTypeORMConfig } from '../src/common/config/test-orm-config';
import { Category } from '../src/category/entities/category.entity';
import { CategoryScore } from '../src/category-score/entities/category-score.entity';
import { Question } from '../src/question/entities/question.entity';
import { QuestionCategory } from '../src/question-category/entities/question-category.entity';
const gql = '/graphql';

describe('question', () => {
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
    mockSurvey.id = 1;
    mockSurvey.surveyTitle = 'Mock Survey for Test';
    await dataSource.manager.save(Survey, mockSurvey);

    const mockCategory = new Category();
    mockCategory.id = 1;
    mockCategory.categoryName = 'Mock Category for Test';
    mockCategory.survey = mockSurvey;
    await dataSource.manager.save(mockCategory);

    const mockCategoryScore = new CategoryScore();
    mockCategoryScore.id = 1;
    mockCategoryScore.highScore = 10;
    mockCategoryScore.lowScore = 0;
    mockCategoryScore.categoryMessage = '배고픕니다.';
    mockCategoryScore.category = mockCategory;
    await dataSource.manager.save(mockCategoryScore);

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
          expect(res.body.data).toBeNull();
        })
    });
    it('디테일한 특정 질문 조회 성공!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          query {
            findOneQuestionDetail(id:1) {
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
            findOneQuestionDetail(id:100) {
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
          expect(res.body.data).toBeNull();
        })
    });
    it('잘못된 query field때문에 디테일한 특정 질문 조회 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          query {
            findOneQuestionDetail(id:1) {
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
  describe('특정 항목을 포함하는 질문 조회!', () => {
    beforeAll(async () => {
      const mockQuestionCategory = new QuestionCategory();
      mockQuestionCategory.id = 1;
      mockQuestionCategory.questionId = 1;
      mockQuestionCategory.categoryName = 'Mock Category for Test';
      mockQuestionCategory.question = await dataSource.manager.findOneBy(Question, ({ id: 1 }));
      await dataSource.manager.save(mockQuestionCategory);
    })
    it('특정 항목을 포함하는 질문 조회 성공!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `{
            findQuestionContainCategory(surveyId:1,categoryName:"Mock Category for Test"){
                questionNumber
                questionContent
            }
          }`,
        })
        .expect(200);
    });
    it('없는 항목이름을 적어서 항목이 어떤 질문에 포함되어 있는지 조회 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `{
            findQuestionContainCategory(surveyId:1,categoryName:"Mock Category"){
                questionNumber
                questionContent
            }
          }`,
        })
        .expect((res) => {
          expect(res.body.data.findQuestionContainCategory).toStrictEqual([]);
        });
    });
    it('항목이름을 안적어서 항목이 어떤 질문에 포함되어 있는지 조회 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `{
            findQuestionContainCategory(surveyId:1,categoryName:){
                questionNumber
                questionContent
            }
          }`,
        })
        .expect(400);
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
