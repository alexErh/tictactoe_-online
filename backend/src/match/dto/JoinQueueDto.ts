import { ApiProperty } from '@nestjs/swagger';

export class JoinQueueDto {
  @ApiProperty()
  nickname: string;

  @ApiProperty()
  elo: number;
}
