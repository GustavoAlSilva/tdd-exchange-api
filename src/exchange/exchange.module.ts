import { Module } from '@nestjs/common';
import { ExchangeService } from './exchange.service';
import { CurrenciesModule } from 'src/currencies/currencies.module';
import { ExchangeController } from './exchange.controller';

@Module({
  imports: [CurrenciesModule],
  providers: [ExchangeService],
  controllers: [ExchangeController],
})
export class ExchangeModule {}
