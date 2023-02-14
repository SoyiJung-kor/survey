import { Test, TestingModule } from '@nestjs/testing';
import { SurveyResolver } from './survey.resolver';
import { SurveyService } from './survey.service';

describe('SurveyResolver', () => {
  let resolver: SurveyResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SurveyResolver, SurveyService],
    }).compile();

    resolver = module.get<SurveyResolver>(SurveyResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
