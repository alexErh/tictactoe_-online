import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class ReturnUserDto {
    @ApiProperty({ example: "d16fe161-169e-4b92-80d8-64808466fb88" })
    @IsString()
    id: string;

    @ApiProperty({ example: 'max123' })
    @IsString()
    nickname: string;

    @ApiProperty({ example: 1000 })
    @IsNumber()
    score: number;

    @ApiProperty({ example: 'data:image/png;base64,iVBORw0K...' })
    @IsString()
    img: string;
}