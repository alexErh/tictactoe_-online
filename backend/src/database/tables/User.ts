import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

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
  })
  img: Buffer;
}
