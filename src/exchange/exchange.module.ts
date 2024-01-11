import { Module } from '@nestjs/common';
import { ExchangeService } from './exchange.service';
import { CurrenciesModule } from 'src/currencies/currencies.module';

@Module({
  imports: [CurrenciesModule],
  providers: [ExchangeService],
})
export class ExchangeModule {}
