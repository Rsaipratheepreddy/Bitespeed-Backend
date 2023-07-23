import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BitespeedController } from './bitespeed.controller';
import { BitespeedService } from './bitespeed.service';
import { ContactEntity } from './entities/contact.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContactEntity])],
  controllers: [BitespeedController],
  providers: [BitespeedService],
})
export class BitespeedModule {}
