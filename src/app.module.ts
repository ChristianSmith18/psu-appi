import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import typeormConfig from './configs/orm.config';
import routes from './routes';

@Module({
  imports: [TypeOrmModule.forRoot(typeormConfig), ...routes],
  controllers: [],
  providers: [],
})
export class AppModule {}
