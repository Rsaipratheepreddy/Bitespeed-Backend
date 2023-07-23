import { Test, TestingModule } from '@nestjs/testing';
import { BitespeedController } from './bitespeed.controller';

describe('BitespeedController', () => {
  let controller: BitespeedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BitespeedController],
    }).compile();

    controller = module.get<BitespeedController>(BitespeedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
