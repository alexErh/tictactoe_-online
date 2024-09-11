import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";


export class CreateGameDto {
    @IsNotEmpty()
    @ApiProperty()
    player1: string;
    
    @IsNotEmpty()
    @ApiProperty()
    player2: string;
}
