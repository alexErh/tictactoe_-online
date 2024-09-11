import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Board } from './Board';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from '../database/tables/Game';
import { Repository } from 'typeorm';
import { User } from '../database/tables/User';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  getWinner(board: Board): string {
    const winner = board.threeInARow();
    if (board.isDraw()) {
      return 'Draw';
    } else {
      return winner;
    }
  }
  async getGameDetails(gameId: number) {
    try {
      const game = await this.gameRepository.findOne({
        where: { id: gameId },
        relations: ['player1', 'player2'],
      });

      if (!game) {
        throw new HttpException('Spiel nicht gefunden', HttpStatus.NOT_FOUND);
      }

      const player1 = game.player1;
      const player2 = game.player2;

      const winner = game.winner
        ? await this.userRepository.findOne({
            where: { nickname: game.winner },
          })
        : null;

      return {
        player1,
        player2,
        winner,
      };
    } catch (error) {
      throw new HttpException(
        'Fehler beim Abrufen der Spieldetails',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
