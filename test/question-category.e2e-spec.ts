/* eslint-disable prettier/prettier */
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
        it.todo('질문 문항 생성 성공!');
    });
    describe('질문 문항 전체 조회!', () => {
        it.todo('질문 문항 전체 조회 성공!');
    })
    describe('아이디로 질문 문항 조회!', () => {
        it.todo('아이디로 질문 문항 전체 조회 성공!');
    })
    describe('항목이 어떤 질문에 포함되어 있는지 조회!', () => {
        it.todo('항목이 어떤 질문에 포함되어 있는지 조회 성공!');
    })
    describe('질문 문항 수정!', () => {
        it.todo('질문 문항 수정 성공!');
    })
    describe('질문 문항 삭제!', () => {
        it.todo('질문 문항 삭제 성공!');
    })
});
