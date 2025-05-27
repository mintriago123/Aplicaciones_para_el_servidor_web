import { Test, TestingModule } from '@nestjs/testing';
import { DatoAexportarController } from './dato-aexportar.controller';
import { DatoAexportarService } from './dato-aexportar.service';

describe('DatoAexportarController', () => {
  let controller: DatoAexportarController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DatoAexportarController],
      providers: [DatoAexportarService],
    }).compile();

    controller = module.get<DatoAexportarController>(DatoAexportarController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
