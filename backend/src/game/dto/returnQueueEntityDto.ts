import { IsNumber, IsString } from "class-validator";

export class ReturnQueueEntityDto {
    @IsString()
    userNickname: string;

    @IsNumber()
    userScore: number;
}