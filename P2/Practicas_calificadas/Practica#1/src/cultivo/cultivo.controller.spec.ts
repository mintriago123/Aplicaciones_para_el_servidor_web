import { Test, TestingModule } from '@nestjs/testing';
import { CultivoController } from './cultivo.controller';
import { CultivoService } from './cultivo.service';

describe('CultivoController', () => {
  let controller: CultivoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CultivoController],
      providers: [CultivoService],
    }).compile();

    controller = module.get<CultivoController>(CultivoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
