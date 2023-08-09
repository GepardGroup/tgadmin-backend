import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ViewedPublication } from 'src/Entities/viewedPublication.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PublicationsService {
  constructor(
    @InjectRepository(ViewedPublication)
    private viewedPublicationRepository: Repository<ViewedPublication>,
  ) {}

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

  async addViewedPublication(publication_id: number, user_id: number) {
    const publication = this.viewedPublicationRepository.create({
      publication_id,
      user_id,
    });

    return await this.viewedPublicationRepository.save(publication);
  }

  async getMyViewedPublications(user_id: number) {
    const publications = await this.viewedPublicationRepository.find({
      where: { user_id },
    });

    return publications;
  }
}
