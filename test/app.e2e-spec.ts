import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Survey } from '../src/survey/entities/survey.entity';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { Answer } from '../src/answer/entities/answer.entity';
import { EachResponse } from '../src/each-response/entities/each-response.entity';
import { Participant } from '../src/participant/entities/participant.entity';
import { ParticipantModule } from '../src/participant/participant.module';
import { Question } from '../src/question/entities/question.entity';
import { SurveyModule } from '../src/survey/survey.module';
import request from 'supertest';
import { Response } from '../src/response/entities/response.entity';
import { DataSource } from 'typeorm';

const gql = '/graphql';

describe('Graphql (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        SurveyModule,
        ParticipantModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: 'postgres',
          database: 'test',
          entities: [
            Answer,
            Participant,
            Question,
            Response,
            Survey,
            EachResponse,
          ],
          synchronize: true,
        }),
        GraphQLModule.forRoot<ApolloDriverConfig>({
          driver: ApolloDriver,
          autoSchemaFile: join(process.cwd(), 'test/schema.gql'),
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    dataSource = moduleFixture.get<DataSource>(DataSource);
  });
  it('be define', async () => {
    expect(app).toBeDefined;
    expect(dataSource).toBeDefined;
  });

  afterAll(async () => {
    await dataSource.dropDatabase();
    app.close();
  });
  describe('survey', () => {
    describe('create survey', () => {
      it('create success survey', async () => {
        return request(app.getHttpServer())
          .post(gql)
          .send({
            query: `
          mutation {
            createSurvey(createSurveyInput:{surveyTitle:"Test Survey"}) {
              id
              surveyTitle
            }
          }
          `,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.createSurvey.id).toBe(1);
            expect(res.body.data.createSurvey.surveyTitle).toBe('Test Survey');
          });
      });
      it('create fail survey', async () => {
        return request(app.getHttpServer())
          .post(gql)
          .send({
            query: `
          mutation createSurvey {
            createSurvey() {
              id
              surveyTitle
            }
          }
          `,
          })
          .expect(400);
      });
    });
    describe('find all survey', () => {
      it('find all surveys', async () => {
        const result = request(app.getHttpServer())
          .post(gql)
          .send({
            query: `{
            findAllSurveys{
              id
              surveyTitle
            }
          }`,
          })
          .expect(200);
        return result;
      });
      it('fail find all surveys', async () => {
        const result = request(app.getHttpServer())
          .post(gql)
          .send({
            query: `{
            findAllSurveys{
              id
              survey
            }
          }`,
          })
          .expect(400);
        return result;
      });
    });
    describe('find a survey', () => {
      it('find a survey', async () => {
        return request(app.getHttpServer())
          .post(gql)
          .send({
            query: `{
            findSurvey(surveyId:1){
              id
              surveyTitle
            }
          }`,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.findSurvey.id).toBe(1);
          });
      });
    });
    describe('update a survey', () => {
      it('update survey', async () => {
        return request(app.getHttpServer())
          .post(gql)
          .send({
            query: `
          mutation updateSurvey {
            updateSurvey(updateSurveyInput:{surveyTitle:"Modified Survey",id:1}) {
              id
              surveyTitle
            }
          }
          `,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.updateSurvey.id).toBe(1);
            expect(res.body.data.updateSurvey.surveyTitle).toBe(
              'Modified Survey',
            );
          });
      });
    });
    // describe('remove a survey', () => {
    //   it('remove survey', async () => {
    //     return request(app.getHttpServer())
    //       .post(gql)
    //       .send({
    //         query: `
    //       mutation removeSurvey {
    //         removeSurvey(surveyId:1) {
    //           id
    //           surveyTitle
    //         }
    //       }
    //       `,
    //       })
    //       .expect(200);
    //   });
    //   it('remove survey', async () => {
    //     const result = request(app.getHttpServer())
    //       .post(gql)
    //       .send({
    //         query: `{
    //         findAllSurveys{
    //           id
    //           surveyTitle
    //         }
    //       }`,
    //       })
    //       .expect((res) => {
    //         expect(res.body.data.findAllSurveys).toHaveLength(0);
    //       })
    //       .expect(200);
    //     return result;
    //   });
    // });
  });
  describe('question', () => {
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
            expect(res.body.data.createQuestion.id).toBe(1);
            expect(res.body.data.createQuestion.questionNumber).toBe(1);
            expect(res.body.data.createQuestion.questionContent).toBe(
              'Test Question',
            );
            expect(res.body.data.createQuestion.survey.id).toBe(1);
            expect(res.body.data.createQuestion.survey.surveyTitle).toBe(
              'Test Survey',
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

  describe('answer', () => {
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
            expect(res.body.data.createAnswer.answerContent).toBe(
              'Test Answer',
            );
            expect(res.body.data.createAnswer.question.id).toBe(1);
            expect(res.body.data.createAnswer.question.questionContent).toBe(
              'Modified Question',
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
  describe('participant', () => {
    describe('create participant', () => {
      it('create success participant', async () => {
        return request(app.getHttpServer())
          .post(gql)
          .send({
            query: `
          mutation {
            createParticipant(createParticipantInput:{email:"test@test.com"}) {
              id
              email
            }
          }
          `,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.createParticipant.id).toBe(1);
            expect(res.body.data.createParticipant.email).toBe('test@test.com');
          });
      });
      it('create fail participant with wrong email', async () => {
        return request(app.getHttpServer())
          .post(gql)
          .send({
            query: `
          mutation createParticipant {
            createSurvey(createParticipantInput:{email:"test@test.d"}) {
              id
              email
            }
          }
          `,
          })
          .expect(400);
      });
    });
    describe('find all participant', () => {
      it('find all participants', async () => {
        return request(app.getHttpServer())
          .post(gql)
          .send({
            query: `{
            findAllParticipants{
              id
              email
            }
          }`,
          })
          .expect(200);
      });
      it('fail find all participants', async () => {
        return request(app.getHttpServer())
          .post(gql)
          .send({
            query: `{
            findAllParticipants{
            }
          }`,
          })
          .expect(400);
      });
    });
    describe('find a participant', () => {
      it('find a participant', async () => {
        return request(app.getHttpServer())
          .post(gql)
          .send({
            query: `{
            findOneParticipant(participantId:1){
              id
              email
            }
          }`,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.findOneParticipant.id).toBe(1);
            expect(res.body.data.findOneParticipant.email).toBe(
              'test@test.com',
            );
          });
      });
    });
    describe('update a participant', () => {
      it('update participant', async () => {
        return request(app.getHttpServer())
          .post(gql)
          .send({
            query: `
          mutation updateParticipant {
            updateParticipant(updateParticipantInput:{email:"modified@test.com",id:1}) {
              id
              email
            }
          }
          `,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.updateParticipant.id).toBe(1);
            expect(res.body.data.updateParticipant.email).toBe(
              'modified@test.com',
            );
          });
      });
    });
    // describe('remove a participant', () => {
    //   it('remove participant', async () => {
    //     return request(app.getHttpServer())
    //       .post(gql)
    //       .send({
    //         query: `
    //       mutation removeParticipant {
    //         removeParticipant(participantId:1) {
    //           id
    //         }
    //       }
    //       `,
    //       })
    //       .expect(200);
    //   });
    //   it('remove participant', async () => {
    //     const result = request(app.getHttpServer())
    //       .post(gql)
    //       .send({
    //         query: `{
    //         findAllParticipants{
    //           id
    //         }
    //       }`,
    //       })
    //       .expect((res) => {
    //         expect(res.body.data.findAllParticipants).toHaveLength(0);
    //       })
    //       .expect(200);
    //     return result;
    //   });
    // });
  });
  describe('response', () => {
    describe('create response', () => {
      it('create success response', async () => {
        return request(app.getHttpServer())
          .post(gql)
          .send({
            query: `
          mutation {
            createResponse(createResponseInput:{surveyId:1,participantId:1}) {
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
      it('create fail response', async () => {
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
    });
    describe('find a response', () => {
      it('find all response', async () => {
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
      it('fail find all responses', async () => {
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
    describe('find a response', () => {
      it('find a response', async () => {
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
            console.log(res);
            expect(res.body.data.findResponse.id).toBe(1);
            expect(res.body.data.findResponse.isSubmit).toBe(false);
            expect(res.body.data.findResponse.sumScore).toBe(0);
          });
      });
      it('fail find a detail response', async () => {
        return request(app.getHttpServer())
          .post(gql)
          .send({
            query: `{
            findResponse(responseId:1){
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
            expect(res.body.data).toBe(null);
            // console.log(res);
            // expect(res.body.data.findResponse.id).toBe(1);
            // expect(res.body.data.findResponse.isSubmit).toBe(false);
            // expect(res.body.data.findResponse.sumScore).toBe(0);
            // expect(res.body.data.findResponse.participant.id).toBe(!1);
            // expect(res.body.data.findResponse.survey.id).toBe(!1);
          });
      });
    });
    describe('update a response', () => {
      it('update response', async () => {
        return request(app.getHttpServer())
          .post(gql)
          .send({
            query: `
          mutation {
            updateResponse(updateResponseInput:{id:1,isSubmit:true}) {
              id
              isSubmit
            }
          }
          `,
          })
          .expect((res) => {
            console.log(res);
            expect(res.body.data.updateResponse.id).toBe(1);
            expect(res.body.data.updateResponse.isSubmit).toBe(true);
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
  it.todo('EachReponse');
});
