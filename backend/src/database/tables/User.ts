import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Buffer } from 'buffer';

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({unique: true})
  nickname: string

  @Column()
  password: string;

  @Column({ default: 1000 })
  score: number;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({
    type: 'blob',
    nullable: true,
  })
  img: Buffer;
}
