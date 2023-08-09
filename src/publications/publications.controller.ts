import { Controller, Res, Post, Body, Get, Query } from '@nestjs/common';
import { Response } from 'express';
import { PublicationsService } from './publications.service';

@Controller('publications')
export class PublicationsController {
  constructor(private PublicationsService: PublicationsService) {}

  @Get('posts')
  async getData(
    @Query('token') token: string,
    @Query('limit') limit: number,
    @Query('channel_id') channel_id: string,
    @Query('channel_ids') channel_ids?: string[],
  ) {
    try {
      if (!channel_ids || channel_ids.length === 0) {
        return await this.PublicationsService.getData(token, limit, channel_id);
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

          const channel = await this.PublicationsService.getData(
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

  @Post('add-viewed-publication')
  async addViewedPublication(
    @Res() res: Response,
    @Body('publication_id') publication_id: number,
    @Body('user_id') user_id: number,
  ) {
    try {
      const publication = await this.PublicationsService.addViewedPublication(
        publication_id,
        user_id,
      );

      return res.json({
        message: 'Статья добавлена в просмотренные',
        publication,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ status: 500, message: 'Ошибка сервера', err });
    }
  }

  @Get('get-my-viewed-publications')
  async getViewedPublications(
    @Res() res: Response,
    @Query('user_id') user_id: number,
  ) {
    try {
      const publications =
        await this.PublicationsService.getMyViewedPublications(user_id);

      return res.json({ publications });
    } catch (err) {
      return res.status(500).json({ status: 500, message: 'Ошибка сервера' });
    }
  }
}
