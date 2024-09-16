import {Component, inject, OnInit} from '@angular/core';
import {SquareComponent} from "../square/square.component";
import { GameDataService, GameStatusDto } from '../services/game-data.service';
import { MatchmakingQueueService } from '../services/matchmaking-queue.service';

@Component({
  selector: 'app-spielseite',
  standalone: true,
  imports: [
    SquareComponent
  ],
  templateUrl: './spielseite.component.html',
  styleUrl: './spielseite.component.css'
})
export class SpielseiteComponent implements OnInit {
  public gameService: GameDataService = inject(GameDataService);
  squares: Square[] = [];
  winner: string | null | undefined;
  currentPlayer: string | null = null;
  myNickname: string | null = null;

  constructor(private matchmakingQueueService: MatchmakingQueueService) {}

  ngOnInit() {
    this.getMyNickname();
    this.newGame();
    this.listenToGameUpdates();
  }
  getMyNickname() {
    this.matchmakingQueueService.getPlayerName().subscribe({
      next: (playerData) => {
        if (playerData) {
          this.myNickname = playerData;
          console.log('My Nickname:', this.myNickname);
        } else {
          console.error('No player name available');
        }
      },
      error: (error) => {
        console.error('Error fetching player name', error);
      }
    });
  }
  newGame() {
    this.squares = Array(9).fill(null).map(() => new Square(null));
    this.winner = undefined;
  }

  makeMove(idx: number) {
    if(this.myNickname != this.gameService.getNextPlayer()) {
      console.warn('Error: Current player is not the active player.');
      alert('Es ist nicht dein Zug!');
      return;
    }
    console.log("makeMove", idx)
    const currentSymbol = this.gameService.makeMove(idx);
    console.log("current", currentSymbol);
    if (currentSymbol === 'X' || currentSymbol === 'O') {
      this.squares[idx] = new Square(currentSymbol);
    }
    else {
      console.error('Ungültiger Zug: currentSymbol ist null oder undefined');
    }
  }

  listenToGameUpdates() {
    this.gameService.listen('newState').subscribe((newGameState) => {
      console.log('Received new game state from server:', newGameState);
      this.squares = newGameState.board.map(value => new Square(value));
      this.currentPlayer = newGameState.nextPlayer;
      console.log("current.player", this.currentPlayer);
    });

    this.gameService.listen('setWinner').subscribe((finalState) => {
      console.log('Received final game state (winner) from server:', finalState);
      this.squares = finalState.board.map(value => new Square(value));
      this.winner = finalState.winner;
      this.gameService.disconnect();
    });
  }

}

class Square {
  value: 'X' | 'O' | null;
  constructor(value: 'X' | 'O' | null) {
    this.value = value;
  }
}

