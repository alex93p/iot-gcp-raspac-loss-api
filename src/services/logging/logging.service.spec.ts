import { Test, TestingModule } from "@nestjs/testing";
import { LoggerWinston } from "./logging.service";

describe("Logging", () => {
  let provider: LoggerWinston;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggerWinston],
    }).compile();

    provider = module.get<LoggerWinston>(LoggerWinston);
  });

  it("should be defined", () => {
    expect(provider).toBeDefined();
  });
});
