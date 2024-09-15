import {Component, inject, OnInit} from '@angular/core';
import {SquareComponent} from "../square/square.component";
import { GameDataService, GameStatusDto } from '../services/game-data.service';

@Component({
  selector: 'app-spielseite',
  standalone: true,
  imports: [
    SquareComponent
  ],
  templateUrl: './spielseite.component.html',
  styleUrl: './spielseite.component.css'
})
export class SpielseiteComponent implements OnInit{
  public gameService: GameDataService = inject(GameDataService);
  squares: Square[] = [];
  xIsNext: boolean | undefined;
  winner: string | null | undefined;
  constructor() {}

  ngOnInit() {
    this.newGame();
    this.listenToGameUpdates();
  }
  newGame() {
    this.squares = Array(9).fill(null).map(() => new Square(null));
    this.winner = undefined;
  }

  makeMove(idx: number) {
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
      //this.winner = newGameState.winner;
    });

    this.gameService.listen('setWinner').subscribe((finalState) => {
      console.log('Received final game state (winner) from server:', finalState);
      this.squares = finalState.board.map(value => new Square(value));
      this.winner = finalState.winner;
    });
  }

}

class Square {
  value: 'X' | 'O' | null;
  constructor(value: 'X' | 'O' | null) {
    this.value = value;
  }
}

