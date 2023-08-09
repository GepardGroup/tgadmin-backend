import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './Entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ChannelsModule } from './channels/channels.module';
import { Channel } from './Entities/channel.entity';
import { PublicationsModule } from './publications/publications.module';
import { ViewedPublication } from './Entities/viewedPublication.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // делает конфиг доступным во всех модулях
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '194-58-90-227.cloudvps.regruhosting.ru',
      port: 5432,
      username: 'postgres',
      password: 'admin',
      database: 'tgadmin',
      entities: [User, Channel, ViewedPublication],
      synchronize: true,
    }),

    AuthModule,
    ChannelsModule,
    PublicationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
