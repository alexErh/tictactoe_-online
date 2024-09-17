import { inject, Injectable, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { catchError, map, Observable, of, tap } from 'rxjs';
import { WebsocketService } from './websocket.service';
import { GameStatusDto } from '../DTOs/gameStateDto';
import { CellValue, PlayerDto } from '../DTOs/playerDto';
import { AuthService } from './auth.service';
import { UserDto } from '../DTOs/userDto';




@Injectable({
  providedIn: 'root'
})
export class GameDataService {
  private userApiUrl = 'http://localhost:3000/users';

  private gameObject?: GameStatusDto;
  private gameBoard: CellValue[] = Array(9).fill(null);
  private nextPlayer: string = '';
  private currentPlayerData?: PlayerDto;
  private opponentPlayerData?: PlayerDto;

  opponentImg = '';

  constructor(
    private webSocketService: WebsocketService,
    private authService: AuthService,
    private http: HttpClient, 
  ) {
  }

  getGameState(): GameStatusDto | undefined {
    return this.gameObject;
  }

  getNextPlayer() {
    return this.nextPlayer;
  }

  getOpponentImg(nickname: string): Observable<string> {
    return this.http.get(`${this.userApiUrl}/${nickname}/pic`, { 
      withCredentials: true,
      responseType: 'text'
     });
  }

  getPlayerData(): void {
    const currentUser = this.authService.getUser();
    this.currentPlayerData = this.gameObject?.player1.nickname === currentUser.nickname ? this.gameObject.player1 : this.gameObject?.player2;
    this.opponentPlayerData = this.gameObject?.player2.nickname === currentUser.nickname ? this.gameObject.player1 : this.gameObject?.player2;
  }

  saveGameObject(gameObject: any) {
    this.gameObject = gameObject;
    this.nextPlayer = gameObject.nextPlayer;
    this.getPlayerData();
  }

  makeMove(board: CellValue[]): void {
    // Erstelle das neue GameStatusDto mit dem aktualisierten Board
    
    this.gameObject!.board = board;
    this.gameObject!.nextPlayer = this.nextPlayer === this.gameObject?.player1.nickname 
      ? this.gameObject!.player2.nickname 
      : this.gameObject!.player1.nickname;

    this.nextPlayer = this.gameObject!.nextPlayer;

    // Sende den neuen Spielstatus an den Server
    this.webSocketService.getSocket().emit('makeMove', this.gameObject);
  }

}
