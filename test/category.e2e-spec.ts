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
import { Survey } from '../src/survey/entities/survey.entity';
import { SurveyModule } from '../src/survey/survey.module';

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
        it.todo('항목 생성 성공!');
        it.todo('항목 이름을 안써서 항목 생성 실패!');
        it.todo('항목 이름이 짧아서 항목 생성 실패!');
        it.todo('항목 이름이 문자열이 아니라 항목 생성 실패!');
        it.todo('설문 아이디가 없어서 항목 생성 실패!');
        it.todo('없는 설문 아이디를 입력해서 항목 생성 실패!');
        it.todo('query field를 잘못 입력해서 항목 생성 실패!');
    });
    describe('전체 항목 조회', () => {
        it.todo('전체항목조회 성공!');
        it.todo('query field를 잘못 입력해서 전체항목조회 실패!');
    });
    describe('선택한 항목 조회', () => {
        it.todo('선택한 항목 조회 성공!');
        it.todo('항목 아이디를 안써서 항목 조회 실패!');
        it.todo('없는 항목 아이디를 입력해서 항목 조회 실패!');
        it.todo('query field를 잘못 입력해서 항목 조회 실패!');
    });
    describe('선택한 항목이 포함된 질문 조회', () => {
        it.todo('선택한 항목이 포함된 질문 조회 성공!');
        it.todo('항목 아이디를 안써서 선택한 항목이 포함된 질문 조회 실패!');
        it.todo('없는 항목 아이디를 입력해서 선택한 항목이 포함된 질문 조회 실패!');
        it.todo('query field를 잘못 입력해서 선택한 항목이 포함된 질문 조회 실패!');
    });
    describe('선택한 항목 수정', () => {
        it.todo('항목 수정 성공!');
        it.todo('항목 아이디를 안써서 항목 수정 실패!');
        it.todo('없는 항목 아이디를 입력해서 항목 수정 실패!');
        it.todo('query field를 잘못 입력해서 항목 수정 실패!');
        it.todo(
            '설문 아이디를 수정, 그런데 존재하지 않는 설문 아이디를 입력해서 항목 수정 실패!',
        );
        it.todo(
            '설문 아이디를 수정, 그런데 설문 아이디 입력 안해서 항목 수정 실패!',
        );
        it.todo('항목 이름 수정, 그러나 항목이름을 입력하지 않아서 항목 수정 실패');
        it.todo('항목 이름 수정, 그러나 항목이름이 문자열이 아니라 항목 수정 실패');
    });
    describe('선택한 항목 삭제', () => {
        it.todo('항목 삭제 성공!');
        it.todo('항목 아이디를 안써서 항목 삭제 실패!');
        it.todo('없는 항목 아이디를 입력해서 항목 삭제 실패!');
        it.todo('query field를 잘못 입력해서 항목 삭제 실패!');
    });
});
