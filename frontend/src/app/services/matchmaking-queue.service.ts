import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class MatchmakingQueueService {

  constructor(private socket: WebsocketService) {}

  joinQueue(player: any) {
    this.socket.emit('joinQueue', player);
  }

  onMatchFound() {
    return this.socket.fromEvent('matchFound');
  }
}
