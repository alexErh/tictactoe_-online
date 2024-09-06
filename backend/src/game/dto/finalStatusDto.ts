import {IsArray, IsString} from "class-validator";

export class FinalStatusDto {

    @IsArray()
    board: CellValue[];

    @IsString()
    winner: string;
}