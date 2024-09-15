import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { GameService } from 'src/game/game.service';
import { PlayerDto } from 'src/users/dto/playerDto';
import { GameStatusDto } from 'src/game/dto/gameStatusDto';
import { QueueEntityDto } from './dto/queueEntityDto';
import { ReturnQueueEntityDto } from './dto/returnQueueEntityDto';
import { CreateGameDto } from 'src/game/dto/createGameDto';

@Injectable()
export class MatchService {

  constructor(
    private readonly userService: UsersService,
    private readonly gameService: GameService,
  ) {}

  async joinPlayersQueue(
    clientId: string,
    nickname: string,
  ): Promise<GameStatusDto | string> {
    const player2 = await this.userService.getOne(nickname);
    if (!player2) return `User ${nickname} not found.`;

    const queue = this.gameService.getWaitingQueue();

    const suitablePlayer = queue.find(
      (e) =>
        Math.abs(e.userScore - player2.score) < 200 &&
        e.userNickname !== player2.nickname,
    );

    const gameStatus = new GameStatusDto();

    if (suitablePlayer) {
      gameStatus.nextPlayer = Math.random() < 0.5 ? suitablePlayer.userNickname : player2.nickname;

      this.leaveQueue(suitablePlayer.clientId);

      const player_1: PlayerDto = {
        clientId: suitablePlayer.clientId,
        nickname: suitablePlayer.userNickname,
        score: suitablePlayer.userScore,
        symbol:
          gameStatus.nextPlayer === suitablePlayer.userNickname ? 'X' : 'O',
      };

      const player_2: PlayerDto = {
        clientId: clientId,
        nickname: player2.nickname,
        score: player2.score,
        symbol: gameStatus.nextPlayer === player2.nickname ? 'X' : 'O',
      };
      const data: CreateGameDto = new CreateGameDto();
      data.player1 = player_1.nickname;
      data.player2 = player_2.nickname;

      gameStatus.player1 = player_1;
      gameStatus.player2 = player_2;

      gameStatus.id = (await this.gameService.createGame(data)).id;
      return gameStatus;
    } else {
      const e: QueueEntityDto = new QueueEntityDto();
      e.clientId = clientId;
      e.userNickname = player2.nickname;
      e.userScore = player2.score;
      if(!queue.some(item => item.userNickname === e.userNickname)) {
        this.gameService.pushPlayerToQueue(e)
      }
      return null;
    }
  }

  leaveQueue(cliendId: string): boolean {
    return this.gameService.popPlayerFromQueue(cliendId);
  }
}
