import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GameStatusDto } from './dto/gameStatusDto';
import { Board } from './Board';
import { GameService } from './game.service';
import { FinalStatusDto } from './dto/finalStatusDto';

@WebSocketGateway()
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly gameService: GameService) {}
  handleConnection(client: Socket) {
    console.log('Client connected: ', client.id);
  }
  handleDisconnect(client: Socket) {
    console.log('Client disconnected: ', client.id);
  }

  @SubscribeMessage('makeMove')
  async handleMove(client: Socket, data: GameStatusDto) {
    const newBoard = new Board(data.board);
    const winner = this.gameService.getWinner(newBoard);
    if (winner === null) {
      if (client.id !== data.player1.client.id) {
        data.player1.client.emit('newState', data);
      } else {
        data.player2.client.emit('newState', data);
      }
    } else {
      const finalState: FinalStatusDto = new FinalStatusDto();
      if (data.player1.symbol === winner)
        finalState.winner = data.player1.nickname;
      else if (data.player2.symbol === winner)
        finalState.winner = data.player2.nickname;
      else finalState.winner = winner;
      finalState.board = data.board;
      data.player1.client.emit('setWinner', finalState);
      data.player2.client.emit('setWinner', finalState);

      const gameId = data.id;
      client.emit('gameEnded', { gameId });
    }
  }
}
