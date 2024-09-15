import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { Player } from '../models/player.model';



@Injectable({
  providedIn: 'root',
})
export class MatchmakingQueueService {
  private apiUrl = 'http://localhost:3000/auth';
  private socket!: Socket;
  private matchFound$ = new BehaviorSubject<any | null>(null);
  constructor(private http: HttpClient) {
    this.getPlayerName();
    this.connect();
  }

  getPlayerName(): Observable<string | null> {
    return this.http.get<{ nickname: string }>(`${this.apiUrl}/me`, { withCredentials: true }).pipe(
      tap(response => {
        console.log('player name',response.nickname);
      }),
      catchError(error => {
        console.error('Error fetching player name', error);
        return of(null);
      }),
      map(response => response ? response.nickname : null)
    );
  }

  connect() {
    this.socket = io('http://localhost:3000/matchmaking', {
      transports: ['websocket']
    });  }


  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  joinQueue(nickname: string) {
    this.socket.emit('joinQueue', nickname);
  }

  cancelQueue() {
    this.socket.emit('cancelQueue');
    this.matchFound$.next(null);
    this.disconnect()
  }

  //onMatchFound: Gibt ein Observable zurück, das auf das matchFound-Ereignis wartet. Wenn ein Gegner gefunden wird, wird der Wert von matchFound$ entsprechend aktualisiert.
  onMatchFound(): Observable<Player | null> {
    return this.listen('newState').pipe(
      map((data) => {
        const clientId = this.socket.id;
        let opponent: Player | null = null;

        if (data.player1.clientId === clientId) {
          opponent = {
            id: data.player2.clientId,
            nickname: data.player2.nickname,
            elo: data.player2.score,
          };
        } else if (data.player2.clientId === clientId) {
          opponent = {
            id: data.player1.clientId,
            nickname: data.player1.nickname,
            elo: data.player1.score,
          };
        }

        console.log("Gegner gefunden:", opponent);
        return opponent;
      }),
      catchError(error => {
        console.error('Error processing match found data', error);
        return of(null); // Gibt null zurück im Falle eines Fehlers
      })
    );
  }


  //listen: Gibt ein Observable zurück, das ein Ereignis vom Server abonniert. Wenn das Ereignis eintritt, wird der Observer mit den empfangenen Daten benachrichtigt.
  // Die Rückgabefunktion sorgt dafür, dass der Listener entfernt wird, wenn das Observable unsubscribed wird.
  listen(event: string): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(event, (data) => {
        console.log(`Event '${event}' received with data:`, data);
        observer.next(data);
      });
      return () => this.socket.off(event);
    });
  }
}
