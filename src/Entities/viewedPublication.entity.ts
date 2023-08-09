import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ViewedPublication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  publication_id: number;

  @Column()
  user_id: number;
}
