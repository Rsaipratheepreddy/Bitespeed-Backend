import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BitespeedModule } from './bitespeed/bitespeed.module';
import { ContactEntity } from './bitespeed/entities/contact.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '28182818',
      database: 'bitespeed',
      entities: [ContactEntity],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([ContactEntity]),
    BitespeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
