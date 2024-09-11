import { Controller, Get, Param } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get(':id')
  async getGameDetails(@Param('id') id: number) {
    return this.gameService.getGameDetails(id);
  }
}
