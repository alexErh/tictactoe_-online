import { IsArray, IsString } from 'class-validator';
import { PlayerDto } from 'src/users/dto/playerDto'; 

export class GameStatusDto {
  @IsString()
  player1: PlayerDto;

  @IsString()
  player2: PlayerDto;

  @IsString()
  nextPlayer: string;

  /* @IsArray()
  board: CellValue[]; */


}