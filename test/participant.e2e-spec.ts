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
import { SurveyModule } from '../src/survey/survey.module';
const gql = '/graphql';
import request from 'supertest';

describe('participant', () => {
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
    });

    afterAll(async () => {
        await dataSource.dropDatabase();
        app.close();
    });

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
    describe('remove a participant', () => {
        it('remove participant', async () => {
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
            const result = request(app.getHttpServer())
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
            return result;
        });
    });
});