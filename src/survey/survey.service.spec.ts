import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Survey } from './entities/survey.entity';
import { SurveyService } from './survey.service';
import { Repository } from 'typeorm';

const mockRepository = () => ({
  save: jest.fn(),
  create: jest.fn(),
});
/**
 * Partial: 타입 T의 모든 요소를 optional하게 만든다.
 * Record: 타입 T의 모든 K의 집합으로 타입을 만들어준다.
 * keyof Repository<T>: Repository의 모든 method key를 불러온다.
 * jest.Mock: method key를 mock으로 만든다.
 * type MockRepository<T = any>: type으로 정의한다.
 */
type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('SurveyService', () => {
  let service: SurveyService;
  let surveyRepository: MockRepository<Survey>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SurveyService,
        {
          provide: getRepositoryToken(Survey),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    service = module.get<SurveyService>(SurveyService);
    surveyRepository = module.get<MockRepository<Survey>>(
      getRepositoryToken(Survey),
    );
  });
  it('be defined', async () => {
    expect(service).toBeDefined;
    expect(surveyRepository).toBeDefined;
  });
  describe('create', () => {
    const createSurveyInput = {
      surveyTitle: 'Test Title',
    };

    it('create survey', async () => {
      const newSurvey =
        surveyRepository.create.mockResolvedValue(createSurveyInput);

      surveyRepository.save.mockResolvedValue(newSurvey);
      const result = await service.create(createSurveyInput);

      expect(result).toEqual(newSurvey);
    });
  });
});
