/* eslint-disable prettier/prettier */
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TestingModule, Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { testTypeORMConfig } from '../src/common/config/test-orm-config';
import { HttpExceptionFilter } from '../src/common/utils/http_exception_filter';
import { ParticipantModule } from '../src/participant/participant.module';
import { Question } from '../src/question/entities/question.entity';
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
        mockSurvey.surveyTitle = 'Mock Survey for Test';
        await dataSource.manager.save(mockSurvey);

        const mockQuestion = new Question();
        mockQuestion.questionContent = 'Mock Question for Test';
        mockQuestion.surveyId = 1;
        mockQuestion.questionNumber = 1;
        mockQuestion.survey = mockSurvey;
        await dataSource.manager.save(mockQuestion);
    });

    afterAll(async () => {
        await dataSource.dropDatabase();
        app.close();
    });

    describe('응답한 설문의 항목 생성', () => {
        it.todo('응답 아이디가 없어서 응답한 설문 항목 생성 성공!')
        it.todo('없는 응답 아이디를 적어서 응답한 설문 항목 생성 실패!')
        it.todo('응답 아이디가 숫자가 아니라서 응답한 설문 항목 생성 실패!')
        it.todo('항목 이름을 안적어서 응답한 설문 항목 생성 실패!')
        it.todo('항목 아이디를 안적어서 응답한 설문 항목 생성 실패!')
    })
});
