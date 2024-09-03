import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MatchService } from '../match.service';
import { JoinQueueDto } from '../dto/JoinQueueDto';

@ApiTags('matchmaking')
@Controller('matchmaking')
export class MatchmakingController {
  constructor(private readonly matchService: MatchService) {}

  @Post('joinQueue')


  @Post('joinQueue')
  @ApiOperation({ summary: 'Einem Matchmaking-Queue beitreten' })
  @ApiResponse({ status: 201, description: 'Spieler erfolgreich der Warteschlange hinzugefügt.' })
  @ApiResponse({ status: 200, description: 'Ein passender Gegner wurde gefunden.', type: Object })
  async joinQueue(@Body() playerData: JoinQueueDto) {
    const match = await this.matchService.findMatch(playerData);
    return match ? match : { message: 'Kein passender Gegner gefunden, Spieler in die Warteschlange aufgenommen.' };
  }
}