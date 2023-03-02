/* eslint-disable prettier/prettier */
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TestingModule, Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { testTypeORMConfig } from '../src/common/config/test-orm-config';
import { HttpExceptionFilter } from '../src/common/utils/http_exception_filter';
import { ParticipantModule } from '../src/participant/participant.module';
import { Survey } from '../src/survey/entities/survey.entity';
import { SurveyModule } from '../src/survey/survey.module';

const gql = '/graphql';

describe('category', () => {
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
    });

    afterAll(async () => {
        await dataSource.dropDatabase();
        app.close();
    });
    describe('항목 생성', () => {
        it('항목 생성 성공!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    createCategory(input:{categoryName:"Test Category",surveyId:1}){
                        id
                        categoryName
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
                    const createCategory = res.body.data.createCategory;
                    const { id, categoryName, survey } = createCategory;

                    expect(id).toBe(1);
                    expect(categoryName).toBe('Test Category');
                    expect(survey.id).toBe(1);
                    expect(survey.surveyTitle).toBe('Mock Survey for Test');
                });

        });
        it('항목 이름을 안써서 항목 생성 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    createCategory(input:{categoryName:,surveyId:1}){
                        id
                        categoryName
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
        it('항목 이름이 짧아서 항목 생성 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    createCategory(input:{categoryName:" ",surveyId:1}){
                        id
                        categoryName
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
                })

        });
        it('항목 이름이 문자열이 아니라 항목 생성 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    createCategory(input:{categoryName:123,surveyId:1}){
                        id
                        categoryName
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
        it('설문 아이디가 없어서 항목 생성 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    createCategory(input:{categoryName:"Test Category",surveyId:}){
                        id
                        categoryName
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
        it('없는 설문 아이디를 입력해서 항목 생성 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    createCategory(input:{categoryName:"Test Category",surveyId:100}){
                        id
                        categoryName
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
        it('query field를 잘못 입력해서 항목 생성 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    createCategory(input:{categoryName:"Test Category",surveyId:1}){
                    }
                }
                `,
                })
                .expect(400);
        });
    });
    describe('전체 항목 조회', () => {
        it('전체 항목 조회 성공!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                    {
                    findAllCategories{
                        id
                        categoryName
                    }
                }
                `,
                })
                .expect(200);
        })
        it('query field를 잘못 입력해서 전체항목조회 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                    {
                    findAllCategories{
                    }
                }
                `,
                })
                .expect(400);
        })
    });
    describe('선택한 항목 조회', () => {
        it('선택한 항목 조회 성공!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                    {
                    findCategory(id:1){
                        id
                        categoryName
                    }
                }
                `,
                })
                .expect((res) => {
                    const findCategory = res.body.data.findCategory;
                    const { id, categoryName } = findCategory;
                    expect(id).toBe(1);
                    expect(categoryName).toBe('Test Category');
                })
        })
        it('항목 아이디를 안써서 항목 조회 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                    {
                    findCategory(id:){
                        id
                        categoryName
                    }
                }
                `,
                })
                .expect(400)
        })
        it('없는 항목 아이디를 입력해서 항목 조회 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                    {
                    findCategory(id:100){
                        id
                        categoryName
                    }
                }
                `,
                })
                .expect((res) => {
                    expect(res.body.data).toBeNull();
                });
        })
        it('query field를 잘못 입력해서 항목 조회 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                    {
                    findCategory(id:1){
                    }
                }
                `,
                })
                .expect(400);
        })
    });
    describe('선택한 항목이 포함된 질문 조회', () => {
        it.todo('선택한 항목이 포함된 질문 조회 성공!');
        it('선택한 항목이 포함된 질문 조회 성공!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                    {
                    findQuestionWithCategory(id:1){
                        id
                        categoryName
                    }
                }
                `,
                })
                .expect(400);
        })
        it.todo('항목 아이디를 안써서 선택한 항목이 포함된 질문 조회 실패!');
        it('항목 아이디를 안써서 선택한 항목이 포함된 질문 조회 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                    {
                    findQuestionWithCategory(id:1){
                        id
                        categoryName
                    }
                }
                `,
                })
                .expect(400);
        })
        it.todo('없는 항목 아이디를 입력해서 선택한 항목이 포함된 질문 조회 실패!');
        it('없는 항목 아이디를 입력해서 선택한 항목이 포함된 질문 조회 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                    {
                    findQuestionWithCategory(id:1){
                        id
                        categoryName
                    }
                }
                `,
                })
                .expect(400);
        })
        it.todo('query field를 잘못 입력해서 선택한 항목이 포함된 질문 조회 실패!');
        it('query field를 잘못 입력해서 선택한 항목이 포함된 질문 조회 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                    {
                    findQuestionWithCategory(id:1){
                        id
                        categoryName
                    }
                }
                `,
                })
                .expect(400);
        })
    });
    describe('선택한 항목 수정', () => {
        it.todo('항목 수정 성공!');
        it('항목 수정 성공!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    updateCategory(input:{categoryName:"Modified Category",id:1}){
                        id
                        categoryName
                    }
                }
                `,
                })
                .expect((res) => {
                    const updateCategory = res.body.data.updateCategory;
                    const { id, categoryName } = updateCategory;
                    expect(id).toBe(1);
                    expect(categoryName).toBe('Modified Category');
                })
        });
        it.todo('항목 아이디를 안써서 항목 수정 실패!');
        it('항목 아이디를 안써서 항목 수정 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    updateCategory(input:{categoryName:"Modified Category",id:}){
                        id
                        categoryName
                    }
                }
                `,
                })
                .expect(400);
        });
        it.todo('없는 항목 아이디를 입력해서 항목 수정 실패!');
        it('없는 항목 아이디를 입력해서 항목 수정 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    updateCategory(input:{categoryName:"Modified Category",id:100}){
                        id
                        categoryName
                    }
                }
                `,
                })
                .expect((res) => {
                    expect(res.body.data).toBeNull();
                })
        });
        it.todo('query field를 잘못 입력해서 항목 수정 실패!');
        it('query field를 잘못 입력해서 항목 수정 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    updateCategory(input:{categoryName:"Modified Category",id:1}){
                    }
                }
                `,
                })
                .expect(400)
        });
        it.todo(
            '설문 아이디를 수정, 그런데 존재하지 않는 설문 아이디를 입력해서 항목 수정 실패!',
        );
        it('설문 아이디를 수정, 그런데 존재하지 않는 설문 아이디를 입력해서 항목 수정 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    updateCategory(input:{categoryName:"Modified Category",id:1,surveyId:100}){
                        id
                        categoryName
                    }
                }
                `,
                })
                .expect(400)
        });
        it.todo(
            '설문 아이디를 수정, 그런데 설문 아이디 입력 안해서 항목 수정 실패!',
        );
        it('설문 아이디를 수정, 그런데 설문 아이디 입력 안해서 항목 수정 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    updateCategory(input:{categoryName:"Modified Category",id:1,surveyId:}){
                        id
                        categoryName
                    }
                }
                `,
                })
                .expect(400)
        });
        it.todo('항목 이름 수정, 그러나 항목이름을 입력하지 않아서 항목 수정 실패');
        it('항목 이름 수정, 그러나 항목이름을 입력하지 않아서 항목 수정 실패', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    updateCategory(input:{categoryName:,id:1}){
                        id
                        categoryName
                    }
                }
                `,
                })
                .expect(400)
        });
        it.todo('항목 이름 수정, 그러나 항목이름이 문자열이 아니라 항목 수정 실패');
        it('항목 이름 수정, 그러나 항목이름이 문자열이 아니라 항목 수정 실패', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    updateCategory(input:{categoryName:123,id:1}){
                        id
                        categoryName
                    }
                }
                `,
                })
                .expect(400)
        });
    });
    describe('선택한 항목 삭제', () => {
        it.todo('항목 삭제 성공!');
        it('항목 삭제 성공!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    removeCategory(id:1){
                        id
                    }
                }
                `,
                })
                .expect(200)
        });
        it.todo('항목 아이디를 안써서 항목 삭제 실패!');
        it('항목 아이디를 안써서 항목 삭제 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    removeCategory(id:){
                        id
                    }
                }
                `,
                })
                .expect(400)
        });
        it.todo('없는 항목 아이디를 입력해서 항목 삭제 실패!');
        it('없는 항목 아이디를 입력해서 항목 삭제 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    removeCategory(id:100){
                        id
                    }
                }
                `,
                })
                .expect((res) => {
                    expect(res.body.data).toBeNull();
                })
        });
        it.todo('query field를 잘못 입력해서 항목 삭제 실패!');
        it('query field를 잘못 입력해서 항목 삭제 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    removeCategory(id:1){
                    }
                }
                `,
                })
                .expect(400)
        });
    });
});
