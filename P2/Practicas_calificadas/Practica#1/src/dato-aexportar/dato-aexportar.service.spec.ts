import { Test, TestingModule } from '@nestjs/testing';
import { DatoAexportarService } from './dato-aexportar.service';

describe('DatoAexportarService', () => {
  let service: DatoAexportarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatoAexportarService],
    }).compile();

    service = module.get<DatoAexportarService>(DatoAexportarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
