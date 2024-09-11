import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  player1: string;

  @Column()
  player2: string;

  @Column('json')
  board: any;

  @Column()
  currentTurn: string;

  @Column({ nullable: true })
  winner: string;
}
