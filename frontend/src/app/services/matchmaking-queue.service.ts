import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { io, Socket } from 'socket.io-client';

export interface Player {
  id?: string;
  nickname: string;
  elo: number;
}

@Injectable({
  providedIn: 'root',
})
export class MatchmakingQueueService {
  private socket!: Socket;
  private matchFound$ = new BehaviorSubject<Player | null>(null);

  constructor() {
    this.connect();
    //Registriert einen Listener für das matchFound-Ereignis.
    this.socket.on('matchFound', (data: Player) => {
      //Wenn ein Gegner gefunden wird, wird das matchFound$-Subject mit den Spieldaten aktualisiert.
      this.matchFound$.next(data);
    });
  }

  connect() {
    this.socket = io('http://localhost:3000', {
      transports: ['websocket']
    });  }

  emit(event: string, data: any) {
    this.socket.emit(event, data);
  }

  //listen: Gibt ein Observable zurück, das ein Ereignis vom Server abonniert. Wenn das Ereignis eintritt, wird der Observer mit den empfangenen Daten benachrichtigt.
  // Die Rückgabefunktion sorgt dafür, dass der Listener entfernt wird, wenn das Observable unsubscribed wird.
  listen(event: string): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(event, (data) => {
        observer.next(data);
      });
      return () => this.socket.off(event);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  joinQueue(playerData: { nickname: string; elo: number }) {
    this.socket.emit('joinQueue', playerData);
  }

  cancelQueue() {
    this.socket.emit('cancelQueue');
    this.matchFound$.next(null);
  }

  //onMatchFound: Gibt ein Observable zurück, das auf das matchFound-Ereignis wartet. Wenn ein Gegner gefunden wird, wird der Wert von matchFound$ entsprechend aktualisiert.
  onMatchFound(): Observable<Player | null> {
    return this.listen('matchFound').pipe(
      tap((opponent) => {
        this.matchFound$.next(opponent);
      })
    );
  }

  getMatchFound(): Observable<Player | null> {
    return this.matchFound$.asObservable();
  }
}
