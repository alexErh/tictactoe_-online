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
import { UsersService } from 'src/users/users.service';
import { AuthGuard } from 'src/helpers/guards/auth.guard';
import { ReturnQueueEntityDto } from './dto/returnQueueEntityDto';

@ApiTags('game')
@Controller('game')
export class GameController {
  constructor(
    private readonly usersService: UsersService,
    private readonly gameService: GameService,
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
  @ApiResponse({ type: [ReturnQueueEntityDto] })
  async getWaitingQueue(
    @Param('nickname') nickname: string,
  ): Promise<ReturnQueueEntityDto[]> {
    if (await this.usersService.isAdmin(nickname))
      return this.gameService.getWaitingPlayers();
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
