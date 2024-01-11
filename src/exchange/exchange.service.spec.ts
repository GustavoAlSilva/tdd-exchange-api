import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeService } from './exchange.service';
import { BadRequestException } from '@nestjs/common';
import { ExchangeInputDto } from './dto/exchange-input.dto';
import { CurrenciesService } from '../currencies/currencies.service';

describe('ExchangeService', () => {
  let service: ExchangeService;
  let currenciesService: CurrenciesService;
  let mockData: ExchangeInputDto;

  beforeEach(async () => {
    const currenciesServiceMock = {
      getCurrency: jest.fn().mockReturnValue({ value: 1 }),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExchangeService,
        { provide: CurrenciesService, useFactory: () => currenciesServiceMock },
      ],
    }).compile();

    service = module.get<ExchangeService>(ExchangeService);
    currenciesService = module.get<CurrenciesService>(CurrenciesService);
    mockData = { from: 'USD', to: 'BRL', amount: 1 };
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('convertAmount()', () => {
    it('should be throw if called with invalid params', async () => {
      mockData.from = '';
      await expect(service.convertAmount(mockData)).rejects.toThrow(new BadRequestException());

      mockData.from = 'USD';
      mockData.amount = 0;
      await expect(service.convertAmount(mockData)).rejects.toThrow(new BadRequestException());

      mockData.from = 'USD';
      mockData.to = '';
      mockData.amount = 1;
      await expect(service.convertAmount(mockData)).rejects.toThrow(new BadRequestException());
    });

    it('should be not throw if called with valid params', async () => {
      await expect(service.convertAmount(mockData)).resolves.not.toThrow();
    });

    it('should be called getCurrency twice', async () => {
      await service.convertAmount(mockData);
      expect(currenciesService.getCurrency).toHaveBeenCalledTimes(2);
    });

    it('should be called getCurrency with correct params', async () => {
      await service.convertAmount(mockData);
      expect(currenciesService.getCurrency).toHaveBeenCalledWith('USD');
      expect(currenciesService.getCurrency).toHaveBeenLastCalledWith('BRL');
    });

    it('should be throw when getCurrency throw', async () => {
      (currenciesService.getCurrency as jest.Mock).mockRejectedValue(new Error());
      mockData.from = 'INVALID';
      await expect(service.convertAmount(mockData)).rejects.toThrow();
    });

    it('should be return conversion value', async () => {
      (currenciesService.getCurrency as jest.Mock).mockResolvedValue({ value: 1 });
      mockData.from = 'USD';
      mockData.to = 'USD';
      expect(await service.convertAmount({ from: 'USD', to: 'USD', amount: 1 })).toEqual({
        amount: 1,
      });

      (currenciesService.getCurrency as jest.Mock).mockResolvedValueOnce({ value: 1 });
      mockData.from = 'USD';
      mockData.to = 'BRL';
      (currenciesService.getCurrency as jest.Mock).mockResolvedValueOnce({ value: 0.2 });
      expect(await service.convertAmount(mockData)).toEqual({
        amount: 5,
      });

      (currenciesService.getCurrency as jest.Mock).mockResolvedValueOnce({ value: 0.2 });
      (currenciesService.getCurrency as jest.Mock).mockResolvedValueOnce({ value: 1 });
      mockData.from = 'BRL';
      mockData.to = 'USD';
      expect(await service.convertAmount(mockData)).toEqual({
        amount: 0.2,
      });
    });
  });
});
