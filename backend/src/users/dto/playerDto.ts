import { IsNumber, IsString } from 'class-validator';
import { Socket } from 'socket.io';

export class PlayerDto {
  client: Socket;

  @IsString()
  nickname: string;

  @IsNumber()
  score: number;

  symbol: 'X' | 'O';

  img: Buffer;
}
