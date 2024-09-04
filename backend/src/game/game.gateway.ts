import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MatchUserDto } from 'src/users/dto/matchUserDto';
import { GameService } from './game.service';
import { GameEntity } from 'src/database/tables/GameEntity';
import { UsersService } from 'src/users/users.service';
import { CreateGameDto } from './dto/createGameDto';
import { NotFoundException } from '@nestjs/common';


@WebSocketGateway()
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  @WebSocketServer()
  server: Server;

  private waitingQueue: {playerData: MatchUserDto, socket: Socket}[] = [];

  constructor(
    private readonly userService: UsersService,
    private readonly gameService: GameService
  ) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.waitingQueue = this.waitingQueue.filter(player => player.socket.id !== client.id);
  }

  @SubscribeMessage('startWaiting')
  async handleStartWaiting(client: Socket, playerData: MatchUserDto) {
    try {
      const user = await this.userService.getOne(playerData.nickname);
      const player = {playerData, socket: client};
      if (!this.waitingQueue.includes(player)) {
        this.waitingQueue.push({playerData, socket: client});
        console.log(`Client ${client.id} waiting for match.`);
        
        this.matchPlayers();
      }
    } catch (error) {
      if (error instanceof NotFoundException)
        client.emit('error', { msg: 'Invalid user.' })
    }
    
  }

  @SubscribeMessage('stopWaiting')
  async handleStopWaiting(client: Socket) {
    this.waitingQueue = this.waitingQueue.filter(player => player.socket.id !== client.id);
    console.log(`Client ${client.id} left waiting queue.`);
  }

  private async matchPlayers() {
    if (this.waitingQueue.length < 2)
      return;

    for (let i = 0; i < this.waitingQueue.length-1; i++)
      for (let j = i+1; j < this.waitingQueue.length; j++) {
        const player1 = this.waitingQueue[i];
        const player2 = this.waitingQueue[j];

        const scoreDiff = Math.abs(player1.playerData.score - player2.playerData.score);
        if (scoreDiff < 200) {
          const createGameDto = new CreateGameDto();
          createGameDto.player1 = await this.userService.getOne(player1.playerData.nickname);
          createGameDto.player2 = await this.userService.getOne(player2.playerData.nickname);

          const game = await this.gameService.createGame(createGameDto);

          player1.socket.emit('matchFound', game);
          player2.socket.emit('matchFound', game);
          
          return;
        }
      }
  }
}
