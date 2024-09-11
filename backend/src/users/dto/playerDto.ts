import { IsNumber, IsString } from 'class-validator';

export class PlayerDto {
  @IsString()
  clientId: string;

  @IsString()
  nickname: string;

  @IsNumber()
  score: number;

  symbol: 'X' | 'O';
}