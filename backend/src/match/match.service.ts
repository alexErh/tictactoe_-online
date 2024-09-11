//Logik des Matchmaking: 1.finden von Gegner 2.warteschlange verwalten
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

  private waitingQueue: QueueEntityDto[] = [];

  constructor(
    private readonly userService: UsersService,
    private readonly gameService: GameService
  ) {}

  async joinPlayersQueue(clientId: string, nickname: string): Promise<GameStatusDto | string> {
    const player2 = await this.userService.getOne(nickname);
    if (!player2)
      return `User ${nickname} not found.`

    const suitablePlayer = this.waitingQueue.find(
      e => Math.abs(e.userScore - player2.score) < 200
    );

    const gameStatus = new GameStatusDto();

    if (suitablePlayer) {

      gameStatus.nextPlayer = Math.random() < 0.5 ? suitablePlayer.userNickname : player2.nickname;

      this.leaveQueue(suitablePlayer.clientId);

      const player_1: PlayerDto = {
        clientId: suitablePlayer.clientId,
        nickname: suitablePlayer.userNickname,
        score: suitablePlayer.userScore,
        symbol: gameStatus.nextPlayer === suitablePlayer.userNickname ? 'X' : 'O'
      }

      const player_2: PlayerDto = {
        clientId: clientId,
        nickname: player2.nickname,
        score: player2.score,
        symbol: gameStatus.nextPlayer === player2.nickname ? 'X' : 'O'
      }
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
      this.waitingQueue.push(e);
      return null;
    }
    
  }

  getWaitingQueue(): ReturnQueueEntityDto[] {
    return this.waitingQueue.map(e => {
      return {
          userNickname: e.userNickname,
          userScore: e.userScore
      }
  });
  }

  leaveQueue(cliendId: string): boolean {
    const initLength: number = this.waitingQueue.length;
    this.waitingQueue = this.waitingQueue.filter(e => e.clientId !== cliendId);
    return initLength < this.waitingQueue.length ? true : false;
  }
}
