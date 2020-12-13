import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationModule } from './routes/location/location.module';

import typeormConfig from './configs/orm.config';
import routes from './routes';

@Module({
  imports: [TypeOrmModule.forRoot(typeormConfig), ...routes, LocationModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
