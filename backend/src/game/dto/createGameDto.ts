import {IsNotEmpty, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateGameDto {

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    player1: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    player2: string;
}