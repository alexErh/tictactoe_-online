import { ApiProperty } from '@nestjs/swagger';

export class GameStatisticsDto {
  @ApiProperty()
  wins: number;

  @ApiProperty()
  losses: number;
}
