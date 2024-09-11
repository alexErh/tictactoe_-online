import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class FinalStatusDto {
  @IsArray()
  board: CellValue[];

  @IsString()
  winner: string;

  @IsNumber()
  id?: number;
}
