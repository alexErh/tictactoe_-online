import { ApiProperty } from "@nestjs/swagger";
import { ReturnUserDto } from '../../users/dto/returnUserDto';
export class PlayersDataDto {

  @ApiProperty({ type: ReturnUserDto })
  currentPlayer: ReturnUserDto;

  @ApiProperty({ type: ReturnUserDto })
  opponentPlayer: ReturnUserDto;
}
