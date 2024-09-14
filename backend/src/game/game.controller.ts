import {
    Controller,
    Delete,
    Get,
    HttpException, HttpStatus,
    Param,
    Session,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { GameEntity } from 'src/database/tables/GameEntity';
import { GameService } from './game.service';
import { ReturnGameDto } from './dto/returnGameDto';
import { ReturnQueueEntityDto } from 'src/match/dto/returnQueueEntityDto';
import { GameStatisticsDto } from './dto/gameStatisticsDto';
import { MatchService } from 'src/match/match.service';
import { UsersService } from 'src/users/users.service';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('game')
@Controller('game')
export class GameController {

    constructor(
        private readonly usersService: UsersService,
        private readonly gameService: GameService,
        private readonly matchService: MatchService
    ) {}

    @Get(':nickname')
    @UseGuards(AuthGuard)
    @ApiResponse({ type: [ReturnGameDto] })
    async getAllUserGames(@Param("nickname") nickname: string): Promise<ReturnGameDto[]> {
        const games = await this.gameService.getAllUserGames(nickname);
        console.log("games", games)
        return games;
    }

    @Get('/active/:nickname')
    @UseGuards(AuthGuard)
    @ApiResponse({ type: [ReturnGameDto] })
    async getAllActiveGames(@Param("nickname") nickname: string): Promise<ReturnGameDto[]> {
        return await this.gameService.getAllActiveGames();
    }

    @Get('/waiting/:nickname')
    @UseGuards(AuthGuard)
    @ApiResponse({ type: [ReturnGameDto] })
    async getWaitingQueue(@Param("nickname") nickname: string): Promise<ReturnQueueEntityDto[]> {
        if (await this.usersService.isAdmin(nickname))
            return this.matchService.getWaitingQueue();
        else
            throw new UnauthorizedException('You are not admin');
        
    }

    @Get('/history')
    @UseGuards(AuthGuard)
    @ApiResponse({ type: [GameEntity] })
    async getGameHistory(@Session() session: Record<string, any>) {
        const nickname = session.user?.nickname;
        if (!nickname) {
            throw new HttpException('Benutzer nicht angemeldet', HttpStatus.UNAUTHORIZED);
        }
        return await this.gameService.getGameHistory(nickname);
    }

    @Get('/statistics')
    @UseGuards(AuthGuard)
    @ApiResponse({ type: GameStatisticsDto })
    async getGameStatistics(@Session() session: Record<string, any>): Promise<GameStatisticsDto> {
        const nickname = session.user?.nickname;
        if (!nickname) {
            throw new HttpException('Benutzer nicht angemeldet', HttpStatus.UNAUTHORIZED);
        }
        return await this.gameService.getGameStatistics(nickname);
    }

    @Delete('/delete/:id')
    async deleteGame(@Param("id") id: string) {
        await this.gameService.deleteGame(id);
    }

}
