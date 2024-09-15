import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";


export class UpdateGameWinnerDto {
    @IsNotEmpty()
    @ApiProperty()
    id: string;

    @IsNotEmpty()
    @ApiProperty()
    winner: string;
}