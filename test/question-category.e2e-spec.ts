
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TestingModule, Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { CategoryScore } from '../src/category-score/entities/category-score.entity';
import { Category } from '../src/category/entities/category.entity';
import { testTypeORMConfig } from '../src/common/config/test-orm-config';
import { HttpExceptionFilter } from '../src/common/utils/http_exception_filter';
import { ParticipantModule } from '../src/participant/participant.module';
import { Question } from '../src/question/entities/question.entity';
import { Survey } from '../src/survey/entities/survey.entity';
import { SurveyModule } from '../src/survey/survey.module';
import request from 'supertest';

const gql = '/graphql';

describe('question-category', () => {
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
        mockSurvey.id = 1;
        await dataSource.manager.save(mockSurvey);

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

        const mockQuestion = new Question();
        mockQuestion.id = 1;
        mockQuestion.questionContent = 'Mock Question for Test';
        mockQuestion.questionNumber = 1;
        mockQuestion.survey = mockSurvey;
        mockQuestion.id = 1;
        await dataSource.manager.save(mockQuestion);
    });

    afterAll(async () => {
        await dataSource.dropDatabase();
        app.close();
    });
    describe('질문 문항 생성!', () => {
        it('질문 문항 생성 성공!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                    mutation {
                        createQuestionCategory(input:{questionId:1,categoryName:"Mock Category for Test"}){
                            id
                            categoryName
                        }
                    }`,
                })
                .expect(200)
                .expect((res) => {
                    const createQuestionCategory = res.body.data.createQuestionCategory;
                    const { id, categoryName } = createQuestionCategory;

                    expect(id).toBe(1);
                    expect(categoryName).toBe('Mock Category for Test');
                });
        });
        it('input을 아예 안넣어서 질문 문항 생성 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                    mutation {
                        createQuestionCategory{
                            id
                            categoryName
                        }
                    }`,
                })
                .expect(400);
        });
        it('questionId를 안적어서 질문 문항 생성 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                    mutation {
                        createQuestionCategory(input:{questionId:,categoryName:"Mock Category for Test"}){
                            id
                            categoryName
                        }
                    }`,
                })
                .expect(400);
        });
        it('없는 questionId를 적어서 질문 문항 생성 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                    mutation {
                        createQuestionCategory(input:{questionId:100,categoryName:"Mock Category for Test"}){
                            id
                            categoryName
                        }
                    }`,
                })
                .expect((res) => {
                    expect(res.body.data).toBeNull();
                });
        });
        it('categoryName을 안적어서 질문 문항 생성 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                    mutation {
                        createQuestionCategory(input:{questionId:1,categoryName:}){
                            id
                            categoryName
                        }
                    }`,
                })
                .expect(400);
        });
        it('categoryName이 너무 짧아서 질문 문항 생성 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                    mutation {
                        createQuestionCategory(input:{questionId:1,categoryName:" "}){
                            id
                            categoryName
                        }
                    }`,
                })
                .expect((res) => {
                    expect(res.body.data).toBeNull();
                });
        });
    });
    describe('질문 문항 전체 조회!', () => {
        it('질문 문항 전체 조회 성공!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `{
            findAllQuestionCategories{
              id
              categoryName
            }
          }`,
                })
                .expect(200);
        });
        it('queryfield를 안적어서 질문 문항 전체 조회 성공!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `{
            findAllQuestionCategories{
            }
          }`,
                })
                .expect(400);
        });
    });
    describe('아이디로 질문 문항 조회!', () => {
        it('아이디로 질문 문항 조회 성공!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `{
            findQuestionCategory(id:1){
              id
              categoryName
            }
          }`,
                })
                .expect(200)
                .expect((res) => {
                    const findQuestionCategory = res.body.data.findQuestionCategory;
                    const { id, categoryName } = findQuestionCategory;
                    expect(id).toBe(1);
                    expect(categoryName).toBe(
                        'Mock Category for Test',
                    );
                });
        });
        it('아이디를 안적어서 질문 문항 전체 조회 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `{
            findQuestionCategory(id:){
              id
              categoryName
            }
          }`,
                })
                .expect(400);
        });
        it('없는 아이디를 적어서 질문 문항 전체 조회 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `{
            findQuestionCategory(id:100){
              id
              categoryName
            }
          }`,
                })
                .expect((res) => {
                    expect(res.body.data).toBeNull();
                });
        });
        it('아이디가 숫자가 아니라 질문 문항 전체 조회 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `{
            findQuestionCategory(id:'1'){
              id
              categoryName
            }
          }`,
                })
                .expect(400);
        });
    });
    describe('질문 문항 수정!', () => {
        it('질문 문항 수정 성공!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                        mutation {
                            updateQuestionCategory(input:{id:1,categoryName:"Modified Category for Test"}){
                                id
                                categoryName
                            }
                        }`,
                })
                .expect(200)
                .expect((res) => {
                    const updateQuestionCategory = res.body.data.updateQuestionCategory;
                    const { id, categoryName } = updateQuestionCategory;
                    expect(id).toBe(1);
                    expect(categoryName).toBe('Modified Category for Test');
                })
        });
        it('아이디를 안적어서 질문 문항 수정 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                        mutation {
                            updateQuestionCategory(input:{id:,categoryName:"Modified Category for Test"}){
                                id
                                categoryName
                            }
                        }`,
                })
                .expect(400)
        });
        it('없는 아이디를 적어서 질문 문항 수정 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                        mutation {
                            updateQuestionCategory(input:{id:100,categoryName:"Modified Category for Test"}){
                                id
                                categoryName
                            }
                        }`,
                })
                .expect((res) => {
                    expect(res.body.data).toBeNull();
                })
        });
        it('질문 수정: 질문 아이디를 안적어서 수정 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                        mutation {
                            updateQuestionCategory(input:{id:1,questionId:}){
                                id
                                categoryName
                            }
                        }`,
                })
                .expect(400)
        });
        it('질문 수정: 없는 질문 아이디를 적어서 수정 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                        mutation {
                            updateQuestionCategory(input:{id:1,questionId:100}){
                                id
                                categoryName
                            }
                        }`,
                })
                .expect((res) => {
                    expect(res.body.data).toBeNull();
                })
        });
        it('질문 수정: 질문 아이디가 숫자가 아니라 수정 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                        mutation {
                            updateQuestionCategory(input:{id:1,questionId:"1"}){
                                id
                                categoryName
                            }
                        }`,
                })
                .expect(400)
        });
        it('항목 이름 수정: 항목 이름이 너무 짧아서 실패!(2글자 미만)', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                        mutation {
                            updateQuestionCategory(input:{id:1,categoryName:" "}){
                                id
                                categoryName
                            }
                        }`,
                })
                .expect((res) => {
                    expect(res.body.data).toBeNull();
                })
        });
        it('항목 이름 수정: 항목 이름을 안적어서 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                        mutation {
                            updateQuestionCategory(input:{id:1,categoryName:}){
                                id
                                categoryName
                            }
                        }`,
                })
                .expect(400)
        });
        it('항목 이름 수정: 항목 이름이 문자열이 아니라 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                        mutation {
                            updateQuestionCategory(input:{id:1,categoryName:1234}){
                                id
                                categoryName
                            }
                        }`,
                })
                .expect(400)
        });
    });
    describe('질문 문항 삭제!', () => {
        it('질문 문항 삭제 성공!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                        mutation {
                            removeQuestionCategory(id:1){
                                id
                            }
                        }`,
                })
                .expect(200);
        });
        it('아이디를 안적어서 질문 문항 삭제 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                        mutation {
                            removeQuestionCategory(id:){
                                id
                            }
                        }`,
                })
                .expect(400);
        });
        it('없는 아이디를 적어서 질문 문항 삭제 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                        mutation {
                            removeQuestionCategory(id:100){
                                id
                            }
                        }`,
                })
                .expect((res) => {
                    expect(res.body.data).toBeNull();
                });
        });
        it('아이디가 숫자가 아니라 질문 문항 삭제 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                        mutation {
                            removeQuestionCategory(id:"1"){
                                id
                            }
                        }`,
                })
                .expect(400);
        });
    });
});
