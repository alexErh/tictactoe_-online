import { IsNumber, IsString } from "class-validator";

export class QueueEntityDto {
    @IsString()
    userNickname: string;

    @IsNumber()
    userScore: number;

    @IsString()
    clientId: string;
}