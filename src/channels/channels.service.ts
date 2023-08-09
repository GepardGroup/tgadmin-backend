import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from 'src/Entities/channel.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel) private channelRepository: Repository<Channel>,
  ) {}

  async addChannel(
    city_id: number,
    user_id: number,
    channel_url: string,
  ): Promise<Channel> {
    const channel = this.channelRepository.create({
      city_id,
      user_id,
      channel_url,
    });

    return await this.channelRepository.save(channel);
  }

  async deleteChannel(id: number) {
    return await this.channelRepository.delete(id);
  }

  async getMyChannels(id: number) {
    return await this.channelRepository.find({ where: { user_id: id } });
  }
}
