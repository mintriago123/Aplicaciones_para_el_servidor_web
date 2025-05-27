import { Test, TestingModule } from '@nestjs/testing';
import { PlagaController } from './plaga.controller';
import { PlagaService } from './plaga.service';

describe('PlagaController', () => {
  let controller: PlagaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlagaController],
      providers: [PlagaService],
    }).compile();

    controller = module.get<PlagaController>(PlagaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
