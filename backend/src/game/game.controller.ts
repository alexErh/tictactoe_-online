import { Controller, Get, Param } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { GameEntity } from 'src/database/tables/GameEntity';
import { GameService } from './game.service';

@Controller('game')
export class GameController {

    constructor(
        private readonly gameService: GameService
    ) {}

    @Get(':nickname')
    @ApiResponse({ type: [GameEntity] })
    async getAllUserGames(@Param("nickname") nickname: string): Promise<GameEntity[]> {
        return await this.gameService.getAllUserGames(nickname);
    }

    @Get('/active')
    @ApiResponse({ type: [GameEntity] })
    async getAllActiveGames(): Promise<GameEntity[]> {
        return await this.gameService.getAllActiveGames();
    }

    @Get('/finished')
    @ApiResponse({ type: [GameEntity] })
    async getAllFinishedGames(): Promise<GameEntity[]> {
        return await this.gameService.getAllFinishedGames();
    }
}
