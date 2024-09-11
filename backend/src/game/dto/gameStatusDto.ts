import { IsArray, IsString } from 'class-validator';
<<<<<<< HEAD
import { PlayerDto } from 'src/users/dto/playerDto'; 
=======
import { PlayerDto } from '../../users/dto/playerDto';
>>>>>>> main

export class GameStatusDto {
  @IsString()
  player1: PlayerDto;

  @IsString()
  player2: PlayerDto;

  @IsString()
  nextPlayer: string;

<<<<<<< HEAD
  /* @IsArray()
  board: CellValue[]; */


}
=======
  @IsArray()
  board: CellValue[];


}
>>>>>>> main
