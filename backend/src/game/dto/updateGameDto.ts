import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";


export class UpdateGameDto {
    @IsNotEmpty()
    @ApiProperty()
    id: string;

    @IsNotEmpty()
    @ApiProperty()
    winner: string;
}