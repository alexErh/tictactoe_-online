import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Player } from '../models/player.model';
import { GameDataService } from './game-data.service';
import { WebsocketService } from './websocket.service';
import { AuthService } from './auth.service';
import { PlayerDto } from '../DTOs/playerDto';
import { GameStatusDto } from '../DTOs/gameStateDto';



@Injectable({
  providedIn: 'root',
})
export class MatchmakingQueueService {
  private apiUrl = 'http://localhost:3000/auth';
  private matchFound$ = new BehaviorSubject<Player | null>(null);
  private gameObject: any;
  constructor(
    private http: HttpClient, 
    private gameDataService: GameDataService, 
    private webSocketService: WebsocketService,
    private authService: AuthService,
  ) {
    this.connect();
  }

  connect() {
    this.webSocketService.connect('game');
  }


  disconnect() {
    if (this.webSocketService.getSocket()) {
      this.webSocketService.disconnect();
    }
  }

  joinQueue(nickname: string) {
    this.webSocketService.getSocket().emit('joinQueue', nickname);
  }

  cancelQueue() {
    this.webSocketService.getSocket().emit('cancelQueue');
    this.matchFound$.next(null);
    this.disconnect()
  }

  //onMatchFound: Gibt ein Observable zurück, das auf das matchFound-Ereignis wartet. Wenn ein Gegner gefunden wird, wird der Wert von matchFound$ entsprechend aktualisiert.
  onMatchFound(): Observable<PlayerDto | null> {
    return this.webSocketService.listen('newState').pipe(
      map((data: GameStatusDto) => {
        const clientId = this.webSocketService.getSocket().id;
        let opponent: PlayerDto = data.player1;

        //save the gameObject to pass it to game-data.service
        this.gameObject = data;
        this.gameDataService.saveGameObject(this.gameObject);

        if (data.player1.clientId === clientId) {
          opponent = data.player2;
        }
        return opponent;
      }),
      catchError(error => {
        console.error('Error processing match found data', error);
        return of(null); // Gibt null zurück im Falle eines Fehlers
      })
    );
  }

}
