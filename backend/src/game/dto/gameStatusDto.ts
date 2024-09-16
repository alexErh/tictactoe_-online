import { IsArray, IsString, ValidateNested } from 'class-validator';
import { PlayerDto } from 'src/users/dto/playerDto';
import { Type } from 'class-transformer';

export class GameStatusDto {
  @IsString()
  id: string;

  @ValidateNested()
  @Type(() => PlayerDto)
  player1: PlayerDto;

  @ValidateNested()
  @Type(() => PlayerDto)
  player2: PlayerDto;

  @IsString()
  nextPlayer: string;

  @IsString()
  winner: string;

  @IsArray()
  board: CellValue[];
}
