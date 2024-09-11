//websocket verwalten
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MatchService } from './match.service';
import { GameStatusDto } from 'src/game/dto/gameStatusDto';

@WebSocketGateway({ cors: true, namespace: 'matchmaking' })
export class MatchGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() 
  server: Server;

  constructor(
    private readonly matchService: MatchService,
  ) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.matchService.leaveQueue(client.id);
  }

  @SubscribeMessage('joinQueue')
  async handleJoinQueue(client: Socket, nickname: string) {
    const gameStatus = await this.matchService.joinPlayersQueue(client.id, nickname);
    console.log("status", gameStatus)
    if (gameStatus) {
      if (gameStatus instanceof GameStatusDto) {
        console.log("match")
        this.server.to(gameStatus.player1.clientId).emit('newState', gameStatus);
        client.emit('newState', gameStatus);
      } else {
        console.log("error")
        client.emit('error', { message: gameStatus });
      }
    }
    console.log("null")
  }
  
  @SubscribeMessage('cancelQueue')
  handleCancelQueue(client: Socket) {
    if (this.matchService.leaveQueue(client.id))
      client.emit('queueCancelled', { message: 'Queue cancelled successfully.' });
  }
}
