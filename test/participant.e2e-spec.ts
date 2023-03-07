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
import { HttpExceptionFilter } from '../src/common/utils/http_exception_filter';
import { testTypeORMConfig } from '../src/common/config/test-orm-config';

describe('participant', () => {
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
  });

  afterAll(async () => {
    await dataSource.dropDatabase();
    app.close();
  });

  describe('참가자 만들기!', () => {
    it('참가자 만들기 성공!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            mutation {
              createParticipant(input:{email:"test@test.com"}) {
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
    it('잘못된 이메일 형식을 입력해서 참가자 만들기 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            mutation createParticipant {
              createSurvey(input:{email:"test@test.d"}) {
                id
                email
              }
            }
            `,
        })
        .expect(400);
    });
  });
  describe('전체 참가자 조회!', () => {
    it('전체 참가자 조회 성공!', async () => {
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
    it('query field가 없어서 전체 참가자 조회 실패!', async () => {
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
  describe('단일 참가자 조회!', () => {
    it('단일 참가자 조회 성공!', async () => {
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
    it('입력한 참가자 아이디에 일치하는 아이디가 없어서 단일 참가자 조회 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `{
              findOneParticipant(participantId:100){
                id
                email
              }
            }`,
        })
        .expect((res) => {
          expect(res.body.data).toBeNull();
        });
    });
    it('참가자 아이디를 입력하지 않아서 단일 참가자 조회 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `{
              findOneParticipant(){
                id
                email
              }
            }`,
        })
        .expect(400);
    });
    it('query field를 잘못 입력해서 단일 참가자 조회 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `{
              findOneParticipant(participantId:1){
                id
                survey
              }
            }`,
        })
        .expect(400);
    });
  });
  describe('참가자 수정', () => {
    it('참가자 수정 성공!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            mutation updateParticipant {
              updateParticipant(input:{email:"modified@test.com",id:1}) {
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
    it('참가자 아이디가 유효하지 않아 수정 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            mutation updateParticipant {
              updateParticipant(input:{email:"modified@test.com",id:100}) {
                id
                email
              }
            }
            `,
        })
        .expect((res) => {
          expect(res.body.data).toBeNull();
        });
    });
    it('참가자 아이디를 입력하지 않아 수정 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            mutation updateParticipant {
              updateParticipant(input:{email:"modified@test.com",id:}) {
                id
                email
              }
            }
            `,
        })
        .expect(400);
    });
    it('이메일이 유효하지 않아 참가자 수정 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            mutation updateParticipant {
              updateParticipant(input:{email:"modified@test.d",id:1}) {
                id
                email
              }
            }
            `,
        })
        .expect((res) => {
          expect(res.body.data).toBeNull();
        });
    });
  });
  describe('참가자 삭제!', () => {
    it('참가자 삭제 성공!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation removeParticipant {
            removeParticipant(participantId:1) {
              id
            }
          }
          `,
        })
        .expect(200);
    });
    it('remove participant', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `{
            findAllParticipants{
              id
            }
          }`,
        })
        .expect((res) => {
          expect(res.body.data.findAllParticipants).toHaveLength(0);
        })
        .expect(200);
    });
    it('참가자 아이디를 입력하지 않아 삭제 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation removeParticipant {
            removeParticipant(participantId:) {
              id
            }
          }
          `,
        })
        .expect(400);
    });
    it('참가자 아이디가 유효하지 않아 삭제 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation removeParticipant {
            removeParticipant(participantId:100) {
              id
            }
          }
          `,
        })
        .expect(200);
    });
    it('query field가 유효하지 않아 참가자 삭제 실패!', async () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation removeParticipant {
            removeParticipant(participantId:1) {
              
            }
          }
          `,
        })
        .expect(400);
    });
  });
});