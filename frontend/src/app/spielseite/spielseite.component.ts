import { Component, inject, OnInit } from '@angular/core';
import { SquareComponent } from "../square/square.component";
import { GameDataService } from '../services/game-data.service';
import { MatchmakingQueueService } from '../services/matchmaking-queue.service';
import { WebsocketService } from '../services/websocket.service';
import { AuthService } from '../services/auth.service';
import { CellValue, PlayerDto } from '../DTOs/playerDto';
import { Observable, tap } from 'rxjs';
import { GameStatusDto } from '../DTOs/gameStateDto';
import { Router } from '@angular/router';

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
  public websocketService: WebsocketService = inject(WebsocketService);

  squares: Square[] = [];
  winner?: string = undefined;
  currentPlayer?: string;
  myNickname?: string;
  currentPlayerData?: PlayerDto;
  opponentPlayerData?: PlayerDto;

  currentUser_img: string = '';
  opponent_img: string = '';

  constructor(
    private authService: AuthService,
    private gameService: GameDataService,
    private router: Router
  ) {
    this.currentPlayer = this.gameService.getNextPlayer();
  }

  ngOnInit() {
    const user = this.authService.getUser();
    if (user) {
      this.myNickname = user.nickname;
      this.currentUser_img = 'data:image/png;base64,'+user.img;
    }
    this.newGame();
    this.getPlayerData();
    if (this.opponentPlayerData){
      this.gameService.getOpponentImg(this.opponentPlayerData.nickname).subscribe({
        next: (data) => {
          this.opponent_img = 'data:image/png;base64,'+data;
        },
        error: (error) => {
          console.error('Error fetching image:', error);
        }
      })
    }
    this.listenToGameUpdates();
  }

  getPlayerData() {
    const state = this.gameService.getGameState();
    this.currentPlayerData = state?.player1.nickname === this.myNickname ? state?.player1 : state?.player2;
    this.opponentPlayerData = state?.player2.nickname === this.myNickname ? state?.player1 : state?.player2;

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
    if (!this.squares[idx].value){
      this.squares[idx] = new Square(this.currentPlayerData!.symbol);
      this.gameService.makeMove(this.squares.map(item => item.value));
      this.currentPlayer = this.gameService.getNextPlayer();
    }else {
      console.error('Ungültiger Zug: currentSymbol ist null oder undefined');
    }
  }

  listenToGameUpdates() {
    this.websocketService.listen('newState').subscribe((newState: GameStatusDto) => {
      this.squares = newState.board.map(value => new Square(value));
      this.currentPlayer = newState.nextPlayer;
    });

    this.websocketService.listen('setWinner').subscribe((finalState: GameStatusDto) => {
      this.squares = finalState.board.map(value => new Square(value));
      this.winner = finalState.winner as string;
      this.websocketService.disconnect();
    });
  }

  goToStart() {
    this.authService.refresh()
  }

}

class Square {
  value: CellValue;
  constructor(value: 'X' | 'O' | null) {
    this.value = value;
  }
}

