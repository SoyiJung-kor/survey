/* eslint-disable prettier/prettier */
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TestingModule, Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { Answer } from '../src/answer/entities/answer.entity';
import { Category } from '../src/category/entities/category.entity';
import { testTypeORMConfig } from '../src/common/config/test-orm-config';
import { HttpExceptionFilter } from '../src/common/utils/http_exception_filter';
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
        mockSurvey.surveyTitle = 'Mock Survey for Test';
        await dataSource.manager.save(mockSurvey);

        const mockQuestion = new Question();
        mockQuestion.questionContent = 'Mock Question for Test';
        mockQuestion.surveyId = 1;
        mockQuestion.questionNumber = 1;
        mockQuestion.survey = mockSurvey;
        await dataSource.manager.save(mockQuestion);

        const mockAnswer = new Answer();
        mockAnswer.answerContent = 'Mock Answer for Test';
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
        mockCategory.categoryName = 'Mock Category for Test';
        mockCategory.survey = mockSurvey;
        await dataSource.manager.save(mockCategory);

        const mockQuestionCategory = new QuestionCategory();
    });

    afterAll(async () => {
        await dataSource.dropDatabase();
        app.close();
    });

    describe('응답한 설문의 항목 생성', () => {
        it.todo('응답한 설문 항목 생성 성공!')
        it.todo('응답 아이디가 없어서 응답한 설문 항목 생성 성공!')
        it.todo('없는 응답 아이디를 적어서 응답한 설문 항목 생성 실패!')
        it.todo('응답 아이디가 숫자가 아니라서 응답한 설문 항목 생성 실패!')
        it.todo('항목 이름을 안적어서 응답한 설문 항목 생성 실패!')
        it.todo('항목 아이디를 안적어서 응답한 설문 항목 생성 실패!')
    })
    describe('응답한 설문의 항목 전체 조회', () => {
        it.todo('응답한 설문의 항목 전체 조회 성공!')
        it.todo('응답한 설문의 항목 전체 조회 실패!')
    })
    describe('아이디로 응답한 설문의 항목 전체 조회', () => {
        it.todo('아이디로 응답한 설문의 항목 전체 조회 성공!')
        it.todo('아이디로 응답한 설문의 항목 전체 조회 실패!')
    })
    describe('응답한 설문의 카테고리별 점수 계산', () => {
        it.todo('응답한 설문의 항목별 점수 계산 성공!')
        it.todo('응답한 설문의 항목별 점수 계산 실패!')
    })
    describe('응답한 설문의 항목 삭제!', () => {
        it.todo('응답한 설문의 항목 삭제 성공!')
        it.todo('응답한 설문의 항목 삭제 실패!')
    })
});
