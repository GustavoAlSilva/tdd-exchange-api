import { EntityRepository, Repository } from 'typeorm';
import { Currencies } from './currencies.entity';
import { InternalServerErrorException } from '@nestjs/common';
import { CurrenciesInputType } from './types/currencies-input.type';
import { validateOrReject } from 'class-validator';

@EntityRepository(Currencies)
export class CurrenciesRepository extends Repository<Currencies> {
  async getCurrency(currency: string): Promise<Currencies> {
    const result = await this.findOne({ where: { currency: currency } });

    if (!result) {
      throw new InternalServerErrorException();
    }

    return result;
  }

  async createCurrency(currenciesInputType: CurrenciesInputType): Promise<Currencies> {
    const createCurrency = new Currencies();
    createCurrency.currency = currenciesInputType.currency;
    createCurrency.value = currenciesInputType.value;

    try {
      await validateOrReject(createCurrency);
      await this.save(createCurrency);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    return createCurrency;
  }

  async updateCurrency({ currency, value }: CurrenciesInputType): Promise<Currencies> {
    return new Currencies();
  }

  async deleteCurrency(currency: string): Promise<void> {
    return;
  }
}
