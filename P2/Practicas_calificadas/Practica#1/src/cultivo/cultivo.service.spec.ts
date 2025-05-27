import { Test, TestingModule } from '@nestjs/testing';
import { CultivoService } from './cultivo.service';

describe('CultivoService', () => {
  let service: CultivoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CultivoService],
    }).compile();

    service = module.get<CultivoService>(CultivoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
