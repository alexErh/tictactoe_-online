import { inject, Injectable, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { io, Socket } from 'socket.io-client';
import { Player } from '../models/player.model';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { WebsocketService } from './websocket.service';
import { considerSettingUpAutocompletion } from '@angular/cli/src/utilities/completion';
import { MatchmakingQueueService } from './matchmaking-queue.service';
type CellValue = 'X' | 'O' | null;
export interface PlayerDto {
  clientId: string | undefined;
  nickname: string;
  score: number;
  symbol: 'X' | 'O';
}

export interface GameStatusDto {
  id: string;
  player1: PlayerDto;
  player2: PlayerDto;
  nextPlayer: string;
  winner: string | null;
  board: CellValue[];
}



@Injectable({
  providedIn: 'root'
})
export class GameDataService {
  private gameObject: any;
  private gameBoard: CellValue[] = Array(9).fill(null);
  private nextPlayer: string| null = null;

  constructor(private webSocketService: WebsocketService) {

  }
  getNextPlayer() {
    return this.nextPlayer;
  }




  saveGameObject(gameObject: any) {
    this.gameObject = gameObject;
    this.nextPlayer = gameObject.nextPlayer;
    console.log('Game object saved:', this.gameObject);
  }

  makeMove(idx: number): CellValue  {
    console.log("idx server: " + idx);
    // Bestimmen, welcher Spieler am Zug ist
    const currentPlayerSymbol = this.gameObject.nextPlayer === this.gameObject.player1.nickname
      ? this.gameObject.player1.symbol
      : this.gameObject.player2.symbol;
    console.log("next", this.nextPlayer);

    // Das Board wird hier aus dem aktuellen Spielstatus aktualisiert

    console.log("updateBoard", this.gameBoard);
    if (this.gameBoard[idx] === null) { // Nur ein Zug erlauben, wenn das Feld leer ist
      this.gameBoard[idx] = currentPlayerSymbol; // Setze das Feld auf das Symbol des aktuellen Spielers
    } else {
      console.error('Das Feld ist bereits belegt');
      return null;
    }

    // Erstelle das neue GameStatusDto mit dem aktualisierten Board
    const gameStatus: GameStatusDto = {
      id: this.gameObject.id,
      player1: this.gameObject.player1,
      player2: this.gameObject.player2,
      nextPlayer: this.gameObject.nextPlayer === this.gameObject.player1.nickname
        ? this.gameObject.player2.nickname
        : this.gameObject.player1.nickname, // Den nächsten Spieler setzen
      winner: null,
      board: this.gameBoard
    };
    this.nextPlayer = gameStatus.nextPlayer;

    // Sende den neuen Spielstatus an den Server
    this.webSocketService.getSocket().emit('makeMove', gameStatus);
    console.log('Move sent to server:', gameStatus);
    return currentPlayerSymbol;
  }

  listen(event: string): Observable<GameStatusDto> {
    return new Observable<GameStatusDto>(observer => {
      const socket = this.webSocketService.getSocket();

      socket.on(event, (data: GameStatusDto) => {
        if (event === 'newState') {
          this.gameBoard = data.board;
          //this.nextPlayer = data.nextPlayer;
        }
        observer.next(data);
      });
      return () => {
        socket.off(event);
      };
    });
  }




  disconnect() {
    if (this.webSocketService.getSocket()) {
      this.webSocketService.getSocket().disconnect();
    }
  }

}
