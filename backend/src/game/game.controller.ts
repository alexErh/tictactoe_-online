import { Controller, Get, Param, UnauthorizedException } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { GameEntity } from 'src/database/tables/GameEntity';
import { GameService } from './game.service';
import { ReturnGameDto } from './dto/returnGameDto';
import { ReturnQueueEntityDto } from 'src/match/dto/returnQueueEntityDto';
import { MatchService } from 'src/match/match.service';
import { UsersService } from 'src/users/users.service';

@ApiTags('game')
@Controller('game')
export class GameController {

    constructor(
        private readonly usersService: UsersService,
        private readonly gameService: GameService,
        private readonly matchService: MatchService
    ) {}

    @Get(':nickname')
    @ApiResponse({ type: [GameEntity] })
    async getAllUserGames(@Param("nickname") nickname: string): Promise<ReturnGameDto[]> {
        return await this.gameService.getAllUserGames(nickname);
    }

    @Get('/active/:nickname')
    @ApiResponse({ type: [GameEntity] })
    async getAllActiveGames(@Param("nickname") nickname: string): Promise<ReturnGameDto[]> {
        if (await this.usersService.isAdmin(nickname))
            return await this.gameService.getAllActiveGames();
        else
            throw new UnauthorizedException('You are not admin');
        
    }

    @Get('/waiting/:nickname')
    @ApiResponse({ type: [GameEntity] })
    async getWaitingQueue(@Param("nickname") nickname: string): Promise<ReturnQueueEntityDto[]> {
        if (await this.usersService.isAdmin(nickname))
            return this.matchService.getWaitingQueue();
        else
            throw new UnauthorizedException('You are not admin');
        
    }
}
