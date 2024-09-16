import { Component, OnInit } from '@angular/core';
import { NavigationComponent } from '../navigation/navigation.component';
import { Router } from '@angular/router';
import { GameDataService, GameStatusDto } from '../services/game-data.service';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [NavigationComponent],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css'],
})
export class ResultsComponent implements OnInit {
  winner: string = 'Kein Gewinner';
  player1: any;
  player2: any;
  gameId: string | undefined;

  constructor(
    private router: Router,
    private gameDataService: GameDataService
  ) {}

  ngOnInit(): void {
    this.listenForWinner();
  }

  private listenForWinner(): void {
    this.gameDataService.listenForWinner().subscribe((data: GameStatusDto) => {
      this.updateGameStatus(data);
      this.gameId = data.id;
    });
  }


  private updateGameStatus(data: GameStatusDto): void {
    this.player1 = data.player1;
    this.player2 = data.player2;
    this.winner = data.winner ? data.winner : 'Kein Gewinner';
  }

  playAgain(): void {
    this.router.navigate(['/matchmaking']);
  }
}
