import { Injectable } from '@nestjs/common';

@Injectable()
export class ChannelsService {
  async getData(token: string, limit: number, channel_id: string) {
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');

    const response = await fetch(
      `https://api.tgstat.ru/channels/posts?token=${token}&limit=${limit}&channelId=${channel_id}`,
      { headers },
    );
    if (!response.ok) {
      throw new Error(
        `Ошибка получения данных. Статус: ${response.status} ${response.statusText}`,
      );
    }

    return await response.json();
  }
}
