import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChannelsController } from './channels/channels.controller';
import { ChannelsService } from './channels/channels.service';

@Module({
  imports: [],
  controllers: [AppController, ChannelsController],
  providers: [AppService, ChannelsService],
})
export class AppModule {}
