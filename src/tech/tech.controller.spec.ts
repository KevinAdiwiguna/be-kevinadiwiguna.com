import { Test, TestingModule } from '@nestjs/testing';
import { TechController } from './tech.controller';
import { TechService } from './tech.service';

describe('TechController', () => {
  let controller: TechController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TechController],
      providers: [TechService],
    }).compile();

    controller = module.get<TechController>(TechController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
