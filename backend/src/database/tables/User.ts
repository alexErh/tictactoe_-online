import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn, Unique } from 'typeorm';
import { Buffer } from 'buffer';

@Entity()
@Unique(['nickname'])
export class User {
  @ApiProperty({ example: 'maxmusterman123' })
  @PrimaryColumn()
  nickname: string;

  @ApiProperty({ example: 'verySecurepassword32!' })
  @Column()
  password: string;

  @ApiProperty({ example: 1000 })
  @Column({ default: 1000 })
  score: number;

  @ApiProperty({ example: false })
  @Column({ default: false })
  isAdmin: boolean;

  @ApiProperty({ example: [] })
  @Column({
    type: 'blob',
    nullable: true,
  })
  img: Buffer;
}
