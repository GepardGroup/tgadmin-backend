import { Controller, Get, Query } from '@nestjs/common';
import { ChannelsService } from './channels.service';

@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Get('posts')
  async getData(
    @Query('token') token: string,
    @Query('limit') limit: number,
    @Query('channel_id') channel_id: string,
  ) {
    try {
      return await this.channelsService.getData(token, limit, channel_id);
    } catch (error) {
      return { error: 'Ошибка при получении данных' };
    }
  }
}
