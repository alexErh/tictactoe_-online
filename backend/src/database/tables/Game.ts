import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true })
  player1: User;

  @ManyToOne(() => User, { eager: true })
  player2: User;

  @Column('json')
  board: any;

  @Column()
  currentTurn: string;

  @Column({ nullable: true })
  winner: string;
}
