import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Currencies } from 'src/currencies/currencies.entity';

export const TypeOrmConfig: TypeOrmModuleOptions = {
  type: 'mongodb',
  url: 'mongodb://1.0.0.3/exchange',
  synchronize: true,
  autoLoadEntities: true,
  entities: [Currencies],
  useUnifiedTopology: true,
};
