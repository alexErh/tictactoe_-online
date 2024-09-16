import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WebsocketService } from './websocket.service';
import { Router } from "@angular/router";

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
  winner?: string | null;
  board: CellValue[];
}

@Injectable({
  providedIn: 'root'
})
export class GameDataService {
  private gameObject: GameStatusDto | null = null;
  private gameBoard: CellValue[] = Array(9).fill(null);
  private nextPlayer: string | null = null;

  constructor(
    private router: Router,
    private webSocketService: WebsocketService) {}

  getNextPlayer() {
    return this.nextPlayer;
  }

  getGameId(): string | undefined {
    return this.gameObject?.id;
  }

  saveGameObject(gameObject: GameStatusDto) {
    this.gameObject = gameObject;
    this.nextPlayer = gameObject.nextPlayer;
    console.log('Game object saved:', this.gameObject);
  }

  makeMove(idx: number): CellValue | null {
    if (this.gameObject!.winner) {
      console.log("Spiel ist bereits beendet. Gewinner: " + this.gameObject!.winner);
      return null;  // Verhindere weitere Züge, wenn ein Gewinner vorhanden ist
    }

    console.log("idx server: " + idx);

    const currentPlayerSymbol = this.gameObject!.nextPlayer === this.gameObject!.player1.nickname
      ? this.gameObject!.player1.symbol
      : this.gameObject!.player2.symbol;

    console.log("next", this.nextPlayer);

    if (this.gameBoard[idx] === null) {
      this.gameBoard[idx] = currentPlayerSymbol;
    } else {
      console.error('Das Feld ist bereits belegt');
      return null;
    }

    const gameStatus: GameStatusDto = {
      id: this.gameObject!.id,
      player1: this.gameObject!.player1,
      player2: this.gameObject!.player2,
      nextPlayer: this.gameObject!.nextPlayer === this.gameObject!.player1.nickname
        ? this.gameObject!.player2.nickname
        : this.gameObject!.player1.nickname,
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
        console.log('Empfangenes Event:', event, 'Daten:', data);
        if (event === 'newState') {
          this.gameBoard = data.board; // Aktualisiere das Board
          this.nextPlayer = data.nextPlayer; // Aktualisiere den nächsten Spieler
        }
        observer.next(data);
      });

      return () => {
        socket.off(event);
      };
    });
  }

  listenForWinner(): Observable<GameStatusDto> {
    return new Observable<GameStatusDto>(observer => {
      const socket = this.webSocketService.getSocket();
      socket.on('setWinner', (data: GameStatusDto) => {
        console.log('setWinner event received for player:', data);
        observer.next(data);
        this.showResults(data);
      });

      return () => {
        socket.off('setWinner');
      };
    });
  }

  private showResults(data: GameStatusDto) {
    console.log('Navigating to results for winner:', data.winner);
    this.router.navigate(['/results'], { queryParams: { winner: data.winner } });
  }

  disconnect() {
    if (this.webSocketService.getSocket()) {
      this.webSocketService.getSocket().disconnect();
    }
  }
}
