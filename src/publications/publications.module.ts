import { Module } from '@nestjs/common';
import { PublicationsController } from './publications.controller';
import { PublicationsService } from './publications.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ViewedPublication } from 'src/Entities/viewedPublication.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ViewedPublication])],
  controllers: [PublicationsController],
  providers: [PublicationsService],
})
export class PublicationsModule {}
