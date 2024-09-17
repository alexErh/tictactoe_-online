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
import {UsersService} from "../users/users.service";
import { UpdateGameWinnerDto } from './dto/updateGameWinnerDto';

@WebSocketGateway({namespace: 'game'})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() 
  server: Server;
  
  constructor(private readonly gameService: GameService,
              private readonly usersService: UsersService) {
  }
  handleConnection(client: Socket) {
    console.log('Client connected: game.gateway ', client.id);
  }
  handleDisconnect(client: Socket) {
    console.log('Client disconnected: ', client.id);
  }

  @SubscribeMessage('joinQueue')
  async handleJoinQueue(client: Socket, nickname: string) {

    const gameStatus = await this.gameService.joinPlayersQueue(client.id, nickname);

    if (gameStatus) {
      if (gameStatus instanceof GameStatusDto) {
        this.server.to(gameStatus.player1.clientId).emit('newState', gameStatus);
        client.emit('newState', gameStatus);
      } else {
        client.emit('error', { message: gameStatus });
      }
    }
  }

  @SubscribeMessage('cancelQueue')
  handleCancelQueue(client: Socket) {
    if (this.gameService.popPlayerFromQueue(client.id))
      client.emit('queueCancelled', { message: 'Queue cancelled successfully.' });
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

      await this.gameService.setWinner(update)
      this.server.to(data.player1.clientId).emit('setWinner', data);
      this.server.to(data.player2.clientId).emit('setWinner', data);
    }
  }

}
