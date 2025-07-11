import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('getApiDocumentation', () => {
    it('should return API documentation object', () => {
      const result = appController.getApiDocumentation();
      expect(result).toHaveProperty('GET /api');
      expect(result['GET /api']).toHaveProperty('description');
    });
  });
});