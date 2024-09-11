import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";
import { User } from "src/database/tables/User";


export class CreateGameDto {
    @IsNotEmpty()
    @ApiProperty()
    player1: string;
    
    @IsNotEmpty()
    @ApiProperty()
    player2: string;
}