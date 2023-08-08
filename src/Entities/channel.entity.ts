import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  city_id: number;

  @Column()
  user_id: number;

  @Column()
  channel_url: string;
}
