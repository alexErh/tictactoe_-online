import {IsNotEmpty, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class SignInDto {

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    nickname: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    password: string;
}