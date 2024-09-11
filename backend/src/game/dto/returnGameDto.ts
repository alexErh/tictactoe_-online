import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { ReturnUserDto } from "src/users/dto/returnUserDto";

export class ReturnGameDto {
    @ApiProperty({ example: "d16fe161-169e-4b92-80d8-64808466fb88" })
    @IsString()
    id: string;

    @ApiProperty()
    player1: ReturnUserDto;

    @ApiProperty()
    player2: ReturnUserDto;

    @ApiProperty()
    @IsString()
    winner: string;
}