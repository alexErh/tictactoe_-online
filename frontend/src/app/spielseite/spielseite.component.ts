import {Component, inject, OnInit} from '@angular/core';
import {SquareComponent} from "../square/square.component";
import {GameDataService} from "../services/game-data.service";

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
  squares: Square[] | undefined;
  xIsNext: boolean | undefined;
  winner: string | undefined;
  constructor() {}

  ngOnInit() {
    this.newGame();
  }
  newGame() {
    this.gameService.createGame('malek', 'moutaz').subscribe((game) => {
      console.log('Neues Spiel erstellt: ', game);
    });
    this.squares = [
      new Square(null),
      new Square(null),
      new Square(null),
      new Square(null),
      new Square(null),
      new Square(null),
      new Square(null),
      new Square(null),
      new Square(null),
    ];
    this.winner = undefined;
    this.xIsNext = true;

  }
  get player() {
    return this.xIsNext ? 'X' : 'O';
  }
  makeMove(idx: number) {
    console.log("idx: "+idx);
  }
}

class Square {
  value: 'X' | 'O' | null;
  constructor(value: 'X' | 'O' | null) {
    this.value = value;
  }
}

