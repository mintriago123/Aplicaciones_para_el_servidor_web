import { Test, TestingModule } from '@nestjs/testing';
import { PlagaService } from './plaga.service';

describe('PlagaService', () => {
  let service: PlagaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlagaService],
    }).compile();

    service = module.get<PlagaService>(PlagaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
