import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';

@Entity()
export class GameEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, {eager: true})
  @JoinColumn()
  player1: User;

  @ManyToOne(() => User, {eager: true})
  @JoinColumn()
  player2: User;

  @Column({
    nullable: true,
  })
  winner: string;
}
