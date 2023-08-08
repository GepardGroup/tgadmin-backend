import {
  Controller,
  Get,
  Query,
  Res,
  Post,
  Body,
  Delete,
} from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { Response } from 'express';

@Controller('channels')
export class ChannelsController {
  constructor(private channelsService: ChannelsService) {}

  @Get('posts')
  async getData(
    @Query('token') token: string,
    @Query('limit') limit: number,
    @Query('channel_id') channel_id: string,
    @Query('channel_ids') channel_ids?: string[],
  ) {
    try {
      if (!channel_ids || channel_ids.length === 0) {
        return await this.channelsService.getData(token, limit, channel_id);
      } else {
        const channels = channel_ids.toString().split(',');
        const result: any = {
          status: '',
          response: {
            count: 0,
            total_count: 0,
            items: [],
          },
        };

        for (let i = 0; i < channels.length; i++) {
          const item = channels[i];

          const channel = await this.channelsService.getData(
            token,
            limit,
            item,
          );

          result.status = channel.status;
          result.response.count += channel.response.count;
          result.response.total_count += channel.response.total_count;
          result.response.items = [
            ...result.response.items,
            ...channel.response.items,
          ];
        }

        return result;
      }
    } catch (error) {
      return { error: 'Ошибка при получении данных' };
    }
  }

  @Get('get-my-channels')
  async getMyChannels(@Res() res: Response, @Query('id') id: number) {
    try {
      const channels = await this.channelsService.getMyChannels(id);

      return res.json({ channels });
    } catch (err) {
      return res.status(500).json({ status: 500, message: 'Ошибка сервера' });
    }
  }

  @Post('add-channel')
  async addChannel(
    @Res() res: Response,
    @Body('user_id') user_id: number,
    @Body('city_id') city_id?: number,
    @Body('channel_url') channel_url?: string,
  ) {
    try {
      if (!city_id) {
        return res
          .status(400)
          .json({ status: 400, message: 'Выберите город!' });
      }

      if (!channel_url) {
        return res
          .status(400)
          .json({ status: 400, message: 'Введите url канала!' });
      }

      const channel = await this.channelsService.addChannel(
        city_id,
        user_id,
        channel_url,
      );

      return res.json({ message: 'Канал добавлен!', channel });
    } catch (err) {
      return res
        .status(500)
        .json({ status: 500, message: 'Ошибка сервера', err });
    }
  }

  @Delete('delete-channel')
  async deleteChannel(@Res() res: Response, @Query('id') id: number) {
    try {
      await this.channelsService.deleteChannel(id);

      return res.json({ message: `Канал ${id} убран из списка` });
    } catch (err) {
      return res.status(500).json({ status: 500, message: 'Ошибка сервера' });
    }
  }
}
