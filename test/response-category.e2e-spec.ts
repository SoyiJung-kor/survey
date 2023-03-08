/* eslint-disable prettier/prettier */
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TestingModule, Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { Answer } from '../src/answer/entities/answer.entity';
import { CategoryScore } from '../src/category-score/entities/category-score.entity';
import { Category } from '../src/category/entities/category.entity';
import { testTypeORMConfig } from '../src/common/config/test-orm-config';
import { HttpExceptionFilter } from '../src/common/utils/http_exception_filter';
import { EachResponse } from '../src/each-response/entities/each-response.entity';
import { Participant } from '../src/participant/entities/participant.entity';
import { ParticipantModule } from '../src/participant/participant.module';
import { QuestionCategory } from '../src/question-category/entities/question-category.entity';
import { Question } from '../src/question/entities/question.entity';
import { Response } from '../src/response/entities/response.entity';
import { Survey } from '../src/survey/entities/survey.entity';
import { SurveyModule } from '../src/survey/survey.module';
const gql = '/graphql';

describe('response-category', () => {
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
        mockSurvey.surveyTitle = 'Mock SurveyTest';
        await dataSource.manager.save(mockSurvey);

        const mockQuestion = new Question();
        mockQuestion.questionContent = 'Mock QuestionTest';
        mockQuestion.surveyId = 1;
        mockQuestion.questionNumber = 1;
        mockQuestion.survey = mockSurvey;
        await dataSource.manager.save(mockQuestion);

        const mockAnswer = new Answer();
        mockAnswer.answerContent = 'Mock AnswerTest';
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

        const mockCategory = new Category();
        mockCategory.id = 1;
        mockCategory.categoryName = 'Mock CategoryTest';
        mockCategory.survey = mockSurvey;
        await dataSource.manager.save(mockCategory);

        const mockQuestionCategory = new QuestionCategory();
        mockQuestionCategory.questionId = 1;
        mockQuestionCategory.question = mockQuestion;
        mockQuestionCategory.categoryName = 'Mock CategoryTest';
        await dataSource.manager.save(mockQuestionCategory);

        const mockCategoryScore = new CategoryScore();
        mockCategoryScore.highScore = 10;
        mockCategoryScore.lowScore = 0;
        mockCategoryScore.categoryMessage = '정상';
        mockCategoryScore.categoryId = 1;
        mockCategoryScore.category = mockCategory;
        await dataSource.manager.save(mockCategoryScore);

        const mockEachResponse = new EachResponse();
        mockEachResponse.responseId = 1;
        mockEachResponse.responseQuestion = 'Mock QuestionTest';
        mockEachResponse.responseAnswer = 'Mock AnswerTest';
        mockEachResponse.responseScore = 5;
        mockEachResponse.response = mockResponse;
        await dataSource.manager.save(mockEachResponse);
    });

    afterAll(async () => {
        await dataSource.dropDatabase();
        app.close();
    });

    describe('응답한 설문의 항목 생성', () => {
        it('응답한 설문 항목 생성 성공!', () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    createResponseCategory(input:{responseId:1,surveyId:1}){
                        id
                        categoryName
                        sumCategoryScore
                        message
                    }
                }`,
                })
                .expect(200);
        })
        it('응답 아이디가 없어서 응답한 설문 항목 생성 실패!', () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    createResponseCategory(input:{responseId:,surveyId:1}){
                        id
                        categoryName
                        sumCategoryScore
                        message
                    }
                }`,
                })
                .expect(400);
        })
        it('없는 응답 아이디를 적어서 응답한 설문 항목 생성 실패!', () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    createResponseCategory(input:{responseId:100,surveyId:1}){
                        id
                        categoryName
                        sumCategoryScore
                        message
                    }
                }`,
                })
                .expect((res) => {
                    expect(res.body.data).toBeNull();
                });
        })
        it('응답 아이디가 숫자가 아니라서 응답한 설문 항목 생성 실패!', () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    createResponseCategory(input:{responseId:"1",surveyId:1}){
                        id
                        categoryName
                        sumCategoryScore
                        message
                    }
                }`,
                })
                .expect(400);
        })
        it('설문 아이디가 없어서 응답한 설문 항목 생성 실패!', () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    createResponseCategory(input:{responseId1:,surveyId:}){
                        id
                        categoryName
                        sumCategoryScore
                        message
                    }
                }`,
                })
                .expect(400);
        })
        it('없는 설문 아이디를 적어서 응답한 설문 항목 생성 실패!', () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    createResponseCategory(input:{responseId:1,surveyId:100}){
                        id
                        categoryName
                        sumCategoryScore
                        message
                    }
                }`,
                })
                .expect((res) => {
                    expect(res.body.data).toBeNull();
                });
        })
        it('설문 아이디가 숫자가 아니라서 응답한 설문 항목 생성 실패!', () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    createResponseCategory(input:{responseId:1,surveyId:"1"}){
                        id
                        categoryName
                        sumCategoryScore
                        message
                    }
                }`,
                })
                .expect(400);
        })
    })
    describe('응답한 설문의 항목 전체 조회', () => {
        it('응답한 설문의 항목 전체 조회 성공!', () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                {
                    findAllResponseCategory{
                        id
                        categoryName
                        sumCategoryScore
                        message
                    }
                }`,
                })
                .expect(200);
        })
        it('응답한 설문의 항목 전체 조회 실패!', () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                {
                    findAllResponseCategory{
                    }
                }`,
                })
                .expect(400);
        })
    })
    describe('아이디로 응답한 설문의 항목 전체 조회', () => {
        it('아이디로 응답한 설문의 항목 전체 조회 성공!', () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                {
                    findResponseCategory(id:1){
                        id
                        categoryName
                        sumCategoryScore
                        message
                    }
                }`,
                })
                .expect(200)
                .expect((res) => {
                    const findResponseCategory = res.body.data.findResponseCategory;
                    const { id, categoryName, sumCategoryScore, message } = findResponseCategory;
                    expect(id).toBe(1);
                    expect(categoryName).toBe('Mock CategoryTest');
                    expect(sumCategoryScore).toBe(0);
                    expect(message).toBe(' ');
                })
        })
        it('아이디가 없어서 아이디로 응답한 설문의 항목 전체 조회 실패!', () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                {
                    findResponseCategory(id:){
                        id
                        categoryName
                        sumCategoryScore
                        message
                    }
                }`,
                })
                .expect(400)
        })
        it('없는 아이디를 입력해서 아이디로 응답한 설문의 항목 전체 조회 실패!', () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                {
                    findResponseCategory(id:100){
                        id
                        categoryName
                        sumCategoryScore
                        message
                    }
                }`,
                })
                .expect((res) => {
                    expect(res.body.data).toBeNull();
                })
        })
        it('아이디가 숫자가 아니라서 아이디로 응답한 설문의 항목 전체 조회 실패!', () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                {
                    findResponseCategory(id:"1"){
                        id
                        categoryName
                        sumCategoryScore
                        message
                    }
                }`,
                })
                .expect(400)
        })
    })
    describe('응답한 설문의 카테고리별 점수 계산', () => {
        it('응답한 설문의 항목별 점수 계산 성공!', () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    sumResponseCategory(input:{responseId:1,surveyId:1}){
                        id
                        sumCategoryScore
                    }
                }`,
                })
                .expect(200);
        })
        it('응답 아이디가 없어서 응답한 설문의 항목별 점수 계산 실패!', () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    sumResponseCategory(input:{responseId:,surveyId:1}){
                        id
                        sumCategoryScore
                    }
                }`,
                })
                .expect(400);
        })
        it('없는 응답 아이디를 입력해서 응답한 설문의 항목별 점수 계산 실패!', () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    sumResponseCategory(input:{responseId:100,surveyId:1}){
                        id
                        sumCategoryScore
                    }
                }`,
                })
                .expect((res) => {
                    expect(res.body.data).toBeNull();
                });
        })
        it('응답 아이디가 숫자가 아니라서 응답한 설문의 항목별 점수 계산 실패!', () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    sumResponseCategory(input:{responseId:"1",surveyId:1}){
                        id
                        sumCategoryScore
                    }
                }`,
                })
                .expect(400);
        })
        it('설문 아이디가 없어서 응답한 설문의 항목별 점수 계산 실패!', () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    sumResponseCategory(input:{responseId:1,surveyId:}){
                        id
                        sumCategoryScore
                    }
                }`,
                })
                .expect(400);
        })
        it('없는 설문 아이디를 입력해서 응답한 설문의 항목별 점수 계산 실패!', () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    sumResponseCategory(input:{responseId:1,surveyId:100}){
                        id
                        sumCategoryScore
                    }
                }`,
                })
                .expect((res) => {
                    expect(res.body.data).toBeNull();
                });
        })
        it('설문아이디가 숫자가 아니라서 응답한 설문의 항목별 점수 계산 실패!', () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    sumResponseCategory(input:{responseId:1,surveyId:"1"}){
                        id
                        sumCategoryScore
                    }
                }`,
                })
                .expect(400);
        })
    })
    describe('응답한 설문의 항목 삭제!', () => {
        it('응답한 설문의 항목 삭제 성공!', () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    removeResponseCategory(id:1){
                        id
                    }
                }`,
                })
                .expect(200);
        })
        it('아이디가 없어서 응답한 설문의 항목 삭제 실패!', () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    removeResponseCategory(id:){
                        id
                    }
                }`,
                })
                .expect(400);
        })
        it('없는 아이디를 입력해서 응답한 설문의 항목 삭제 실패!', () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    removeResponseCategory(id:100){
                        id
                    }
                }`,
                })
                .expect((res) => {
                    expect(res.body.data).toBeNull();
                });
        })
    })
    describe('응답한 설문 결과 메세지 확인', () => {
        it('응답한 설문 결과 메세지 확인 성공!', () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    compareScore(responseId:1,surveyId:1){
                        id
                        message
                    }
                }`,
                })
                .expect(200);
        })
    })
    it('응답 아이디가 없어서 응답한 설문의 결과메세지 확인 실패!', () => {
        return request(app.getHttpServer())
            .post(gql)
            .send({
                query: `
                mutation {
                    compareScore(responseId:,surveyId:1){
                        id
                        message
                    }
                }`,
            })
            .expect(400);
    })
    it('없는 응답 아이디를 적어서 응답한 설문의 결과메세지 확인 실패!', () => {
        return request(app.getHttpServer())
            .post(gql)
            .send({
                query: `
                mutation {
                    compareScore(responseId:100,surveyId:1){
                        id
                        message
                    }
                }`,
            })
            .expect((res) => {
                expect(res.body.data).toBeNull();
            });
    })
    it('설문 아이디가 없어서 응답한 설문의 결과메세지 확인 실패!', () => {
        return request(app.getHttpServer())
            .post(gql)
            .send({
                query: `
                mutation {
                    compareScore(responseId:1,surveyId:){
                        id
                        message
                    }
                }`,
            })
            .expect(400);
    })
    it('없는 설문 아이디를 적어서 응답한 설문의 결과메세지 확인 실패!', () => {
        return request(app.getHttpServer())
            .post(gql)
            .send({
                query: `
                mutation {
                    compareScore(responseId:1,surveyId:100){
                        id
                        message
                    }
                }`,
            })
            .expect((res) => {
                expect(res.body.data).toBeNull();
            });
    })
})
