import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class GameEndedService {private socket: Socket;
  private gameEndedSubject = new Subject<number>();
  gameEnded$ = this.gameEndedSubject.asObservable();

  constructor() {
    this.socket = io('http://localhost:3000');
    this.socket.on('gameEnded', (data: { gameId: number }) => {
      this.gameEndedSubject.next(data.gameId);
    });
  }
}
