import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateScoreDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  nickname: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  score?: number;

  /* @IsOptional()
  @IsBoolean()
  @ApiProperty()
  isAdmin?: boolean; */
}
