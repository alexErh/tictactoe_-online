import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ description: 'User nickname', example: 'john_doe' })
  @IsString()
  nickname: string;

  @ApiProperty({ description: 'New password', example: 'newPassword123' })
  @IsString()
  password: string;
}
