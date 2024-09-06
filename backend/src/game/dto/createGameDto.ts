import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../database/tables/User';

export class CreateGameDto {
  @IsNotEmpty()
  @ApiProperty()
  player1: User;

  @IsNotEmpty()
  @ApiProperty()
  player2: User;
}
