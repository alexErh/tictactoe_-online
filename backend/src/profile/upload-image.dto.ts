import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadImageDto {
  @ApiProperty({ description: 'User nickname', example: 'john_doe' })
  @IsString()
  nickname: string;
}
