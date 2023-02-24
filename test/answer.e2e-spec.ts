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
import { Survey } from '../src/survey/entities/survey.entity';
import { SurveyModule } from '../src/survey/survey.module';
const gql = '/graphql';
import request from 'supertest';
import { Question } from '../src/question/entities/question.entity';

describe('answer', () => {
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
        dataSource.manager.save(mockSurvey);

        const mockQuestion = new Question();
        mockQuestion.questionContent = 'Mock Question for Test';
        mockQuestion.surveyId = 1;
        mockQuestion.questionNumber = 1;
        mockQuestion.survey = mockSurvey;
        await dataSource.manager.save(mockQuestion);

        console.log(mockSurvey);
        console.log(mockQuestion);
        console.log((await dataSource.manager.find(Question)).length);
    });

    afterAll(async () => {
        await dataSource.dropDatabase();
        app.close();
    });
    describe('create answer', () => {
        it('create success answer', async () => {
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
                    expect(res.body.data.createAnswer.id).toBe(1);
                    expect(res.body.data.createAnswer.answerNumber).toBe(1);
                    expect(res.body.data.createAnswer.answerContent).toBe('Test Answer');
                    expect(res.body.data.createAnswer.question.id).toBe(1);
                    expect(res.body.data.createAnswer.question.questionContent).toBe(
                        'Mock Question for Test',
                    );
                });
        });
        it('create fail answer', async () => {
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
    });
    describe('find all answer', () => {
        it('find all answers', async () => {
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
        it('fail find all answers', async () => {
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
    describe('find a answer', () => {
        it('find a answer', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `{
              findAnswer(answerId:1){
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
    });
    describe('update a answer', () => {
        it('update answer', async () => {
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
    });
    // describe('remove a answer', () => {
    //   it('remove answer', async () => {
    //     return request(app.getHttpServer())
    //       .post(gql)
    //       .send({
    //         query: `
    //       mutation removeAnswer {
    //         removeAnswer(answerId:1) {
    //           id
    //         }
    //       }
    //       `,
    //       })
    //       .expect(200);
    //   });
    //   it('remove answer', async () => {
    //     const result = request(app.getHttpServer())
    //       .post(gql)
    //       .send({
    //         query: `{
    //         findAllAnswers{
    //           id
    //         }
    //       }`,
    //       })
    //       .expect((res) => {
    //         expect(res.body.data.findAllAnswers).toHaveLength(0);
    //       })
    //       .expect(200);
    //     return result;
    //   });
    // });
});
