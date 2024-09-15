import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdatePasswordDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    nickname: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    oldPW: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    newPW: string;
}