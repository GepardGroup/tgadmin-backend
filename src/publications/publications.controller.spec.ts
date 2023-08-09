import { Test, TestingModule } from '@nestjs/testing';
import { PublicationsController } from './publications.controller';

describe('ViewedPublicationsController', () => {
  let controller: PublicationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicationsController],
    }).compile();

    controller = module.get<PublicationsController>(PublicationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
