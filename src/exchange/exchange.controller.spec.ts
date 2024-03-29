import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeController } from './exchange.controller';
import { BadRequestException } from '@nestjs/common';
import { ExchangeService } from './exchange.service';
import { ExchangeType } from './types/exchange.type';

describe('ExchangeController', () => {
  let controller: ExchangeController;
  let service: ExchangeService;
  let mockData;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExchangeController],
      providers: [{ provide: ExchangeService, useFactory: () => ({ convertAmount: jest.fn() }) }],
    }).compile();

    controller = module.get<ExchangeController>(ExchangeController);
    service = module.get<ExchangeService>(ExchangeService);
    mockData = { from: 'INVALID', to: 'INVALID', amount: 1 };
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('convertAmount()', () => {
    it('should be throw when service throw', async () => {
      (service.convertAmount as jest.Mock).mockRejectedValue(new BadRequestException());
      await expect(controller.convertAmount(mockData)).rejects.toThrow(new BadRequestException());
    });

    it('should be called service with corrects params', async () => {
      await controller.convertAmount(mockData);
      expect(service.convertAmount).toHaveBeenCalledWith(mockData);
    });

    it('should be the return value is equal to the return value of the service', async () => {
      const mockReturn = { amount: 1 } as ExchangeType;
      (service.convertAmount as jest.Mock).mockReturnValue(mockReturn);
      expect(await controller.convertAmount(mockData)).toEqual(mockReturn);
    });
  });
});
