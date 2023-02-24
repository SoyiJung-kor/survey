/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { Survey } from '../src/survey/entities/survey.entity';
import request from 'supertest';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { INestApplication } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { typeORMConfig } from '../src/common/config/orm-config';
import { ParticipantModule } from '../src/participant/participant.module';
import { SurveyModule } from '../src/survey/survey.module';
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
        await app.init();
        dataSource = moduleFixture.get<DataSource>(DataSource);

        const mockSurvey = new Survey();
        mockSurvey.id = 1;
        mockSurvey.surveyTitle = 'Mock Survey for Test';
        dataSource.manager.save(Survey, mockSurvey);
    });


    afterAll(async () => {
        await dataSource.dropDatabase();
        app.close();
    });

    describe('create question', () => {
        it('create success question', async () => {
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
                    console.log(res.body.data);
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
        it('create fail question', async () => {
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
    });
    describe('find all question', () => {
        it('find all questions', async () => {
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
        it('fail find all questions', async () => {
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
    describe('find a question', () => {
        it('find a question', async () => {
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
                    console.log(res.body.data);
                    expect(res.body.data.findQuestion.questionNumber).toBe(1);
                    expect(res.body.data.findQuestion.questionContent).toBe(
                        'Test Question',
                    );
                });
        });
        it.todo('find a detail question');
    });
    describe('update a question', () => {
        it('update question', async () => {
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
                    console.log(res.body.data);
                    expect(res.body.data.updateQuestion.id).toBe(1);
                    expect(res.body.data.updateQuestion.questionContent).toBe(
                        'Modified Question',
                    );
                });
        });
    });
    // describe('remove a question', () => {
    //   it('remove question', async () => {
    //     return request(app.getHttpServer())
    //       .post(gql)
    //       .send({
    //         query: `
    //       mutation removeQuestion {
    //         removeQuestion(questionId:1) {
    //           id
    //         }
    //       }
    //       `,
    //       })
    //       .expect(200);
    //   });
    //   it('remove question', async () => {
    //     const result = request(app.getHttpServer())
    //       .post(gql)
    //       .send({
    //         query: `{
    //         findAllQuestions{
    //           id
    //         }
    //       }`,
    //       })
    //       .expect((res) => {
    //         expect(res.body.data.findAllQuestions).toHaveLength(0);
    //       })
    //       .expect(200);
    //     return result;
    //   });
    // });
});