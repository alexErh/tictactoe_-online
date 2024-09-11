import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameStatusDto } from './dto/gameStatusDto';
import {Board} from "./Board";
import {GameService} from "./game.service";
import {FinalStatusDto} from "./dto/finalStatusDto";
import { UpdateGameWinnerDto } from './dto/updateGameWinnerDto';

@WebSocketGateway({namespace: 'game'})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() 
  server: Server;
  
  constructor(private readonly gameService: GameService) {
  }
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
    if(winner === null) {
      if(client.id !== data.player1.clientId) {
        this.server.to(data.player1.clientId).emit('newState', data);
      } else {
        this.server.to(data.player2.clientId).emit('newState', data);
      }
    } else {//if someone has won or draw
      /* const finalState : FinalStatusDto = new FinalStatusDto(); */
      if(data.player1.symbol === winner)
        data.winner = data.player1.nickname;
      else if(data.player2.symbol === winner)
        data.winner = data.player2.nickname;
      else
        data.winner = winner;
      
      const update: UpdateGameWinnerDto = new UpdateGameWinnerDto();
      update.id = data.id;
      update.winner = data.winner;

      this.gameService.setWinner(update)
      this.server.to(data.player1.clientId).emit('setWinner', data);
      this.server.to(data.player2.clientId).emit('setWinner', data);
    }
  }
}
