import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class MatchUserDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    nickname: string;
    
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    score: number;
}