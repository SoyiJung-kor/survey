import { Test, TestingModule } from "@nestjs/testing";
import { EachResponseService } from "./each-response.service";

describe("EachResponseService", () => {
  let service: EachResponseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EachResponseService],
    }).compile();

    service = module.get<EachResponseService>(EachResponseService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
