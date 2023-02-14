import { Test, TestingModule } from '@nestjs/testing';
import { ResponseResolver } from './response.resolver';
import { ResponseService } from './response.service';

describe('ResponseResolver', () => {
  let resolver: ResponseResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResponseResolver, ResponseService],
    }).compile();

    resolver = module.get<ResponseResolver>(ResponseResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
