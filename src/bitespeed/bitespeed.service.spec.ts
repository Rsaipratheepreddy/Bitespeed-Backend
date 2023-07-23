import { Test, TestingModule } from '@nestjs/testing';
import { BitespeedService } from './bitespeed.service';

describe('BitespeedService', () => {
  let service: BitespeedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BitespeedService],
    }).compile();

    service = module.get<BitespeedService>(BitespeedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
