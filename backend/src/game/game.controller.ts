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
import { ReturnQueueEntityDto } from './dto/returnQueueEntityDto';
import { AdminGuard } from 'src/helpers/guards/admin.guard';

@ApiTags('game')
@Controller('game')
export class GameController {
  constructor(
    private readonly usersService: UsersService,
    private readonly gameService: GameService,
  ) {}

  @Get(':nickname')
  @ApiResponse({ type: [ReturnGameDto] })
  async getAllUserGames(
    @Param('nickname') nickname: string,
  ): Promise<ReturnGameDto[]> {
    const games = await this.gameService.getAllUserGames(nickname);
    return games;
  }

  @Get('/active/:nickname')
  @UseGuards(AdminGuard)
  @ApiResponse({ type: [ReturnGameDto] })
  async getAllActiveGames(
    @Param('nickname') nickname: string,
  ): Promise<ReturnGameDto[]> {
    if (await this.usersService.isAdmin(nickname))
      return await this.gameService.getAllActiveGames();
    else 
      throw new UnauthorizedException('You are not admin');
  }

  @Get('/waiting/:nickname')
  @UseGuards(AdminGuard)
  @ApiResponse({ type: [ReturnQueueEntityDto] })
  async getWaitingQueue(
    @Param('nickname') nickname: string,
  ): Promise<ReturnQueueEntityDto[]> {
    if (await this.usersService.isAdmin(nickname))
      return this.gameService.getWaitingPlayers();
    else 
      throw new UnauthorizedException('You are not admin');
  }

  @Get('statistics/:nickname')
  async getGameStatistics(
    @Param('nickname') nickname: string,
  ): Promise<{ wins: number; losses: number; games: ReturnGameDto[] }> {
    console.log('stats')
    return await this.gameService.getGameStatistics(nickname);
  }

  @Delete('/delete/:id')
  async deleteGame(@Param('id') id: string) {
    await await this.gameService.deleteGame(id);
  }
}
