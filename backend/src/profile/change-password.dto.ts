import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ description: 'User nickname' })
  @IsString()
  nickname: string;

  @ApiProperty({ description: 'New password' })
  @IsString()
  password: string;
}
