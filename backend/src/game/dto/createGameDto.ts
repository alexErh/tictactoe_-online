import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { User } from "src/database/tables/User";


export class CreateGameDto {
    @IsNotEmpty()
    @ApiProperty()
    player1: User;
    
    @IsNotEmpty()
    @ApiProperty()
    player2: User;
}