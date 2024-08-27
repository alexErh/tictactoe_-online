import {IsNotEmpty, IsOptional, IsString, IsNumber, IsBoolean} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class UpdateUserDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    nickname: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    password?: string;

    @IsOptional()
    @IsNumber()
    @ApiProperty()
    score?: number;

    @IsOptional()
    @IsBoolean()
    @ApiProperty()
    isAdmin?: boolean;
}