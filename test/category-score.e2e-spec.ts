/* eslint-disable prettier/prettier */
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TestingModule, Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { Category } from '../src/category/entities/category.entity';
import { testTypeORMConfig } from '../src/common/config/test-orm-config';
import { HttpExceptionFilter } from '../src/common/utils/http_exception_filter';
import { ParticipantModule } from '../src/participant/participant.module';
import { Survey } from '../src/survey/entities/survey.entity';
import { SurveyModule } from '../src/survey/survey.module';
import request from 'supertest';

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
        mockSurvey.id = 1;
        await dataSource.manager.save(mockSurvey);

        const mockCategory = new Category();
        mockCategory.id = 1;
        mockCategory.categoryName = 'Mock Category for Test';
        mockCategory.survey = mockSurvey;
        await dataSource.manager.save(mockCategory);
    });

    afterAll(async () => {
        await dataSource.dropDatabase();
        app.close();
    });
    describe('기준점수 생성!', () => {
        it('기준점수 생성 성공!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    createCategoryScore(input:{highScore:10,lowScore:0,categoryMessage:"배고픕니다.",categoryId:1}){
                        id
                        highScore
                        lowScore
                        categoryMessage
                    }
                }
                `,
                })
                .expect(200)
                .expect((res) => {
                    const createCategoryScore = res.body.data.createCategoryScore;
                    const { id, highScore, lowScore, categoryMessage } = createCategoryScore;

                    expect(id).toBe(1);
                    expect(highScore).toBe(10);
                    expect(lowScore).toBe(0);
                    expect(categoryMessage).toBe('배고픕니다.');
                });
        });
        it('기준점수를 안적어서 기준점수 생성 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    createCategoryScore(input:{highScore:,lowScore:,categoryMessage:"배고픕니다.",categoryId:1}){
                        id
                        highScore
                        lowScore
                        categoryMessage
                    }
                }
                `,
                })
                .expect(400);
        });
        it('기준점수를 숫자로 안적어서 기준점수 생성 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    createCategoryScore(input:{highScore:"10",lowScore:"0",categoryMessage:"배고픕니다.",categoryId:1}){
                        id
                        highScore
                        lowScore
                        categoryMessage
                    }
                }
                `,
                })
                .expect(400);
        });
        it('안내문구를 안적어서 기준점수 생성 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    createCategoryScore(input:{highScore:10,lowScore:0,categoryMessage:,categoryId:1}){
                        id
                        highScore
                        lowScore
                        categoryMessage
                    }
                }
                `,
                })
                .expect(400);
        });
        it('안내문구가 너무 짧아서 기준점수 생성 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    createCategoryScore(input:{highScore:10,lowScore:0,categoryMessage:" ",categoryId:1}){
                        id
                        highScore
                        lowScore
                        categoryMessage
                    }
                }
                `,
                })
                .expect((res) => {
                    expect(res.body.data).toBeNull();
                });
        });
        it('안내문구가 문자열이 아니라서 기준점수 생성 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    createCategoryScore(input:{highScore:10,lowScore:0,categoryMessage:배고픕니다.,categoryId:1}){
                        id
                        highScore
                        lowScore
                        categoryMessage
                    }
                }
                `,
                })
                .expect(400);
        });
        it('항목 아이디를 안적어서 기준점수 생성 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    createCategoryScore(input:{highScore:10,lowScore:0,categoryMessage:"배고픕니다.",categoryId:}){
                        id
                        highScore
                        lowScore
                        categoryMessage
                    }
                }
                `,
                })
                .expect(400);
        });
        it('없는 항목 아이디를 적어서 기준점수 생성 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    createCategoryScore(input:{highScore:10,lowScore:0,categoryMessage:"배고픕니다.",categoryId:100}){
                        id
                        highScore
                        lowScore
                        categoryMessage
                    }
                }
                `,
                })
                .expect((res) => {
                    expect(res.body.data).toBeNull();
                });
        });
        it('항목 아이디를 숫자로 안적어서 기준점수 생성 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    createCategoryScore(input:{highScore:10,lowScore:0,categoryMessage:"배고픕니다.",categoryId:"1"}){
                        id
                        highScore
                        lowScore
                        categoryMessage
                    }
                }
                `,
                })
                .expect(400);
        });
    })
    describe('전체 기준점수 조회!', () => {
        it('전체 기준점수 조회 성공!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                {
                    findAllCategoryScores{
                        id
                        highScore
                        lowScore
                        categoryMessage
                    }
                }
                `,
                })
                .expect(200);
        });
    })
    describe('기준점수 아이디로 기준점수 조회!', () => {
        it('아이디로 기준점수 조회 성공!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                {
                    findCategoryScore(id:1){
                        id
                        highScore
                        lowScore
                        categoryMessage
                    }
                }
                `,
                })
                .expect(200);
        });
        it('없는 아이디로 기준점수 조회 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                {
                    findCategoryScore(id:100){
                        id
                        highScore
                        lowScore
                        categoryMessage
                    }
                }
                `,
                })
                .expect((res) => {
                    expect(res.body.data).toBeNull();
                });
        });
        it('아이디를 안적어서 기준점수 조회 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                {
                    findCategoryScore(id:){
                        id
                        highScore
                        lowScore
                        categoryMessage
                    }
                }
                `,
                })
                .expect(400);
        });
    })
    describe('기준점수 수정!', () => {
        it('기준점수 수정 성공!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    updateCategoryScore(input:{id:1,highScore:10,lowScore:0,categoryMessage:"배부릅니다.",categoryId:1}){
                        id
                        highScore
                        lowScore
                        categoryMessage
                    }
                }
                `,
                })
                .expect(200)
                .expect((res) => {
                    const updateCategoryScore = res.body.data.updateCategoryScore;
                    const { id, highScore, lowScore, categoryMessage } = updateCategoryScore;

                    expect(id).toBe(1);
                    expect(highScore).toBe(10);
                    expect(lowScore).toBe(0);
                    expect(categoryMessage).toBe('배부릅니다.');
                });
        });
        it('기준점수 아이디를 안적어서 기준점수 수정 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    updateCategoryScore(input:{id:,highScore:10,lowScore:0,categoryMessage:"배부릅니다.",categoryId:1}){
                        id
                        highScore
                        lowScore
                        categoryMessage
                    }
                }
                `,
                })
                .expect(400);
        });
        it('없는 기준점수 아이디를 적어서 기준점수 수정 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    updateCategoryScore(input:{id:100,highScore:10,lowScore:0,categoryMessage:"배부릅니다.",categoryId:1}){
                        id
                        highScore
                        lowScore
                        categoryMessage
                    }
                }
                `,
                })
                .expect((res) => {
                    expect(res.body.data).toBeNull();
                });
        });
        it('기준점수 아이디가 숫자가 아니라 기준점수 수정 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    updateCategoryScore(input:{id:"100",highScore:10,lowScore:0,categoryMessage:"배부릅니다.",categoryId:1}){
                        id
                        highScore
                        lowScore
                        categoryMessage
                    }
                }
                `,
                })
                .expect(400);
        });
        it('기준점수수정: 기준점수를 입력하지 않아서 수정 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    updateCategoryScore(input:{id:1,highScore:,lowScore:,categoryMessage:"배부릅니다.",categoryId:1}){
                        id
                        highScore
                        lowScore
                        categoryMessage
                    }
                }
                `,
                })
                .expect(400);
        });
        it('기준점수수정: 기준점수가 숫자가 아니라 수정 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    updateCategoryScore(input:{id:1,highScore:"100",lowScore:"100",categoryMessage:"배부릅니다.",categoryId:1}){
                        id
                        highScore
                        lowScore
                        categoryMessage
                    }
                }
                `,
                })
                .expect(400);
        });
        it('안내문구수정: 안내문구를 입력하지 않아서 수정 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    updateCategoryScore(input:{id:1,highScore:10,lowScore:0,categoryMessage:,categoryId:1}){
                        id
                        highScore
                        lowScore
                        categoryMessage
                    }
                }
                `,
                })
                .expect(400);
        });
        it('안내문구수정: 안내문구가 문자열이 아니라 수정 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    updateCategoryScore(input:{id:1,highScore:10,lowScore:0,categoryMessage:배부릅니다.,categoryId:1}){
                        id
                        highScore
                        lowScore
                        categoryMessage
                    }
                }
                `,
                })
                .expect(400);
        });
        it('안내문구수정: 안내문구가 너무 짧아서 수정 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    updateCategoryScore(input:{id:1,highScore:10,lowScore:0,categoryMessage:" ",categoryId:1}){
                        id
                        highScore
                        lowScore
                        categoryMessage
                    }
                }
                `,
                })
                .expect((res) => {
                    expect(res.body.data).toBeNull();
                });
        });
        it('항목수정: 항목 아이디를 안적어서 수정 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    updateCategoryScore(input:{id:1,highScore:10,lowScore:0,categoryMessage:"배부릅니다.",categoryId:}){
                        id
                        highScore
                        lowScore
                        categoryMessage
                    }
                }
                `,
                })
                .expect(400);
        });
        it('항목수정: 존재하지 않는 항목 아이디를 적어서 수정 실패!', async () => {
            return request(app.getHttpServer())
                .post(gql)
                .send({
                    query: `
                mutation {
                    updateCategoryScore(input:{id:1,highScore:10,lowScore:0,categoryMessage:"배부릅니다.",categoryId:100}){
                        id
                        highScore
                        lowScore
                        categoryMessage
                    }
                }
                `,
                })
                .expect((res) => {
                    expect(res.body.data).toBeNull();
                });
        });
    })
    describe('기준점수 삭제!', () => {
        it.todo('기준점수 삭제 성공!');
        it.todo('기준점수 아이디를 안적어서 기준점수 삭제 실패!');
        it.todo('없는 기준점수 아이디를 적어서 기준점수 삭제 실패!');
    })
});
