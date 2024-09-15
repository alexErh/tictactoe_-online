import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameEntity } from 'src/database/tables/GameEntity';
import { User } from 'src/database/tables/User';
import { IsNull, Not, Repository } from 'typeorm';
import { CreateGameDto } from './dto/createGameDto';
import { UpdateGameWinnerDto } from './dto/updateGameWinnerDto';
import { ReturnGameDto } from './dto/returnGameDto';
import { ReturnUserDto } from 'src/users/dto/returnUserDto';
import { Board } from './Board';
import { QueueEntityDto } from './dto/queueEntityDto';
import { ReturnQueueEntityDto } from './dto/returnQueueEntityDto';
import { GameStatusDto } from './dto/gameStatusDto';
import { UsersService } from 'src/users/users.service';
import { PlayerDto } from 'src/users/dto/playerDto';


@Injectable()
export class GameService {

    private waitingQueue: QueueEntityDto[] = [];

    constructor(
      @InjectRepository(GameEntity)
      private readonly gameRepository: Repository<GameEntity>,
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
      private readonly usersService: UsersService,
    ) {}

    async getAllUserGames(nickname: string): Promise<ReturnGameDto[]> {
      const user: User = await this.userRepository.findOne({
        where: { nickname: nickname },
      });
      if (!user)
        throw new NotFoundException(
          `There is no user with nickname ${nickname}.`,
        );
    
      return (
        await this.gameRepository.find({
          where: [{ player1: user }, { player2: user }],
          relations: ['player1', 'player2'],
        })
      ).map((e) => {
        return this.returnGame(e);
      });
    }
  
  async getAllActiveGames(): Promise<ReturnGameDto[]> {
    const games = await this.gameRepository.find({
      where: {
        player1: Not(IsNull()),
        player2: Not(IsNull()),
        winner: IsNull(),
      },
      relations: ['player1', 'player2'], // Spieler-Relationen mitladen
    });

    return games.map((game) => {
      return this.returnGame(game);
    });
  }

  async createGame(data: CreateGameDto): Promise<ReturnGameDto> {
    const player1 = await this.userRepository.findOne({
      where: { nickname: data.player1 },
    });
    const player2 = await this.userRepository.findOne({
      where: { nickname: data.player2 },
    });
    const e: GameEntity = new GameEntity();
    e.player1 = player1;
    e.player2 = player2;
    const newGame = await this.gameRepository.save(e);
    return this.returnGame(newGame);
  }

  async setWinner(data: UpdateGameWinnerDto): Promise<ReturnGameDto> {
    const game = await this.gameRepository.findOne({ where: { id: data.id } });
    if (game.winner.trim().length <= 0)
      throw new ConflictException(`Winner already exist.`);

    const player1: User = game.player1;
    const player2: User = game.player2;
    const k = 20;
    //Berechnung von der Partiepunktzahl von beiden Spieler
    let s_player1 = data.winner === player1.nickname ? 1 : 0;
    s_player1 = data.winner === 'Draw' ? 0.5 : s_player1;
    let s_player2 = data.winner === player2.nickname ? 1 : 0;
    s_player2 = data.winner === 'Draw' ? 0.5 : s_player2;
    //Berechnung von dem Erwartungswerd der beiden Spieler
    const e_player1 = 1 / (1 + 10 ** ((player2.score-player1.score) / 400));
    const e_player2 = 1 / (1 + 10 ** ((player1.score-player2.score) / 400));
    //Die resultierende Elo-Zahl
    const r1_player1 = player1.score + k * (s_player1 - e_player1);
    const r1_player2 = player2.score + k * (s_player2 - e_player2);
    
    player1.score = r1_player1;
    this.userRepository.save(player1);
    
    player2.score = r1_player2;
    this.userRepository.save(player2);
    
    game.winner = data.winner;
    const updatedGame = await this.gameRepository.save(game);
    return this.returnGame(updatedGame);
  }

  async deleteGame(id: string) {
    const game = await this.gameRepository.findOne({ where: { id: id } });
    if (game.winner && game.winner !== '')
      throw new ConflictException(
        "You can't delete this game entity. Winner already exist.",
      );
    this.gameRepository.remove(game);
  }

  private returnGame(game: GameEntity): ReturnGameDto {
    const player1 = new ReturnUserDto();
    if (game.player1) {
      player1.id = game.player1.id;
      player1.nickname = game.player1.nickname;
      player1.score = game.player1.score;
      player1.img = game.player1.img
        ? game.player1.img.toString('base64')
        : null;
    }

    const player2 = new ReturnUserDto();
    if (game.player2) {
      player2.id = game.player2.id;
      player2.nickname = game.player2.nickname;
      player2.score = game.player2.score;
      player2.img = game.player2.img
        ? game.player2.img.toString('base64')
        : null;
    }

    return {
      id: game.id,
      player1: player1,
      player2: player2,
      winner: game.winner,
    };
  }

  getWaitingPlayers(): ReturnQueueEntityDto[] {
    return this.waitingQueue.map(e => {
        return {
            userNickname: e.userNickname,
            userScore: e.userScore
        }
    })
  }

  async joinPlayersQueue(
    clientId: string,
    nickname: string,
  ): Promise<GameStatusDto | string> {
    const player2 = await this.usersService.getOne(nickname);
    if (!player2) return `User ${nickname} not found.`;


    const suitablePlayer = this.waitingQueue.find(
      (e) =>
        Math.abs(e.userScore - player2.score) < 200 &&
        e.userNickname !== player2.nickname,
    );

    const gameStatus = new GameStatusDto();

    if (suitablePlayer) {
      gameStatus.nextPlayer = Math.random() < 0.5 ? suitablePlayer.userNickname : player2.nickname;

      this.popPlayerFromQueue(suitablePlayer.clientId);

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

      gameStatus.id = (await this.createGame(data)).id;
      return gameStatus;
    } else {
      const e: QueueEntityDto = new QueueEntityDto();
      e.clientId = clientId;
      e.userNickname = player2.nickname;
      e.userScore = player2.score;
      if(!this.waitingQueue.some(item => item.userNickname === e.userNickname)) {
        this.pushPlayerToQueue(e)
      }
      return null;
    }
  }

  getWaitingQueue(): QueueEntityDto[] {
    return this.waitingQueue;
  }

  pushPlayerToQueue(data: QueueEntityDto) {
    this.waitingQueue.push(data);
  }

  popPlayerFromQueue(cliendId: string): boolean {
    const oldLength = this.waitingQueue.length;
    this.waitingQueue = this.waitingQueue.filter(e => e.clientId !== cliendId);
    return this.waitingQueue.length < oldLength ? true : false;
  }

  getWinner(board: Board): string {
    const winner = board.threeInARow();
    if (board.isDraw()) {
      return 'Draw';
    } else {
      return winner;
    }
  }

  async getGameStatistics(
    nickname: string,
  ): Promise<{ wins: number; losses: number; games: ReturnGameDto[] }> {
    try {
      const user = await this.userRepository.findOne({
        where: { nickname: nickname },
      });

      if (!user) {
        return { wins: 0, losses: 0, games: [] };
      }

      const games = await this.gameRepository.find({
        where: [{ player1: user }, { player2: user }],
        relations: ['player1', 'player2'],
      });

      const wins = games.filter((game) => game.winner === user.nickname).length;
      const losses = games.filter(
        (game) => game.winner !== null && game.winner !== user.nickname,
      ).length;

      const gameDtos = games.map((game) => {
        return {
          id: game.id,
          player1: {
            nickname: game.player1.nickname,
          },
          player2: {
            nickname: game.player2.nickname,
          },
          winner: game.winner,
        } as ReturnGameDto;
      });

      return { wins, losses, games: gameDtos };
    } catch (error) {
      throw new HttpException(
        'Fehler beim Abrufen der Spielstatistik',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
