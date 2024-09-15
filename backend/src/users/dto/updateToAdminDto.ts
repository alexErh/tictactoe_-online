import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateToAdminDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    adminNickname: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    nickname: string;
}