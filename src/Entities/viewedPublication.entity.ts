import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ViewedPublication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint' })
  publication_id: number;

  @Column()
  user_id: number;
}
