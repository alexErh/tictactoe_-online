import { Injectable } from '@nestjs/common';
import { Board } from './Board';

@Injectable()
export class GameService {
  getWinner(board: Board): string {
    const winner = board.threeInARow();
    if (board.isDraw()) {
      return 'Draw';
    } else {
      return winner;
    }
  }
}
