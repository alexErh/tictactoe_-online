//websocket verwalten
import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MatchService } from './match.service';
import { UsersService } from '../users/users.service';


@WebSocketGateway({ cors: true, namespace: 'matchmaking' })
export class MatchGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private matchService: MatchService, private usersService: UsersService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.matchService.disconnect(client.id);
  }

  @SubscribeMessage('identify')
  async handleIdentify(client: Socket, user: string) {
    await this.matchService.identify(user, client.id);
  }


  @SubscribeMessage('joinQueue')
  async handleJoinQueue(client: Socket, nickname: string) {
    const playerData = await this.matchService.getPlayerData(nickname);
    if (playerData) {
      playerData.clientId = client.id;
      const match = await this.matchService.findMatch(playerData);
      if (match) {
        this.server.to(client.id).emit('matchFound', match);
        this.server.to(match.clientId).emit('matchFound', playerData);
      }
    } else {
      this.server.to(client.id).emit('error', { message: 'User not found' });
    }
  }
  @SubscribeMessage('cancelQueue')
  async handleCancelQueue(client: Socket) {
    this.matchService.cancelQueue(client.id);
    this.server.to(client.id).emit('queueCancelled', { message: 'Queue cancelled successfully.' });
  }
}