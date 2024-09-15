import {
  Controller,
  Delete,
  Get,
  Param,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { GameService } from './game.service';
import { ReturnGameDto } from './dto/returnGameDto';
import { ReturnQueueEntityDto } from 'src/match/dto/returnQueueEntityDto';
import { MatchService } from 'src/match/match.service';
import { UsersService } from 'src/users/users.service';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('game')
@Controller('game')
export class GameController {
  constructor(
    private readonly usersService: UsersService,
    private readonly gameService: GameService,
    private readonly matchService: MatchService,
  ) {}

  @Get(':nickname')
  @UseGuards(AuthGuard)
  @ApiResponse({ type: [ReturnGameDto] })
  async getAllUserGames(
    @Param('nickname') nickname: string,
  ): Promise<ReturnGameDto[]> {
    const games = await this.gameService.getAllUserGames(nickname);
    console.log('games', games);
    return games;
  }

  @Get('/active/:nickname')
  @UseGuards(AuthGuard)
  @ApiResponse({ type: [ReturnGameDto] })
  async getAllActiveGames(
    @Param('nickname') nickname: string,
  ): Promise<ReturnGameDto[]> {
    return await this.gameService.getAllActiveGames();
  }

  @Get('/waiting/:nickname')
  @UseGuards(AuthGuard)
  @ApiResponse({ type: [ReturnGameDto] })
  async getWaitingQueue(
    @Param('nickname') nickname: string,
  ): Promise<ReturnQueueEntityDto[]> {
    if (await this.usersService.isAdmin(nickname))
      return this.matchService.getWaitingQueue();
    else throw new UnauthorizedException('You are not admin');
  }

  @Get('statistics/:nickname')
  async getGameStatistics(
    @Param('nickname') nickname: string,
  ): Promise<{ wins: number; losses: number; games: ReturnGameDto[] }> {
    return this.gameService.getGameStatistics(nickname);
  }

  @Delete('/delete/:id')
  async deleteGame(@Param('id') id: string) {
    await this.gameService.deleteGame(id);
  }
}
