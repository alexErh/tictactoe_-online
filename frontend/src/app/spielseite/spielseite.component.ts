import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';  // Importiere Router
import { SquareComponent } from "../square/square.component";
import { GameDataService } from '../services/game-data.service';
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

  constructor(
    private matchmakingQueueService: MatchmakingQueueService,
    private router: Router  // Router injizieren
  ) {}

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
    const currentSymbol = this.gameService.makeMove(idx);
    if (currentSymbol === 'X' || currentSymbol === 'O') {
      this.squares[idx] = new Square(currentSymbol);
    } else {
      console.error('Ungültiger Zug: currentSymbol ist null oder undefined');
    }
  }

  listenToGameUpdates() {
    // Lausche auf den neuen Spielstatus
    this.gameService.listen('newState').subscribe((newGameState) => {
      this.squares = newGameState.board.map(value => new Square(value));
      this.currentPlayer = newGameState.nextPlayer;
    });

    // Lausche auf das Spielende (Gewinner oder Unentschieden)
    this.gameService.listen('setWinner').subscribe((finalState) => {
      this.squares = finalState.board.map(value => new Square(value));
      this.winner = finalState.winner;

      // Weiterleitung zur Ergebnisseite, sobald das Spiel beendet ist
      if (this.winner) {
        this.router.navigate(['/results'], { state: { winner: this.winner, gameId: this.gameService.getGameId() } });
      }

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
