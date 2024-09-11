import { Component, OnInit } from '@angular/core';
import { GameEndedService } from '../services/game-ended.service';
import { ResultService } from '../services/result.service';
import { Router } from '@angular/router';
import { NavigationComponent } from '../navigation/navigation.component';

@Component({
  selector: 'app-resultat',
  templateUrl: './resultat.component.html',
  standalone: true,
  styleUrls: ['./resultat.component.css'],
  imports: [
    NavigationComponent,
  ],
})
export class ResultatComponent implements OnInit {
  winner: string = '';
  player1: any;
  player2: any;
  gameId: number = 0;

  constructor(
    private router: Router,
    private gameSocketService: GameEndedService,
    private resultService: ResultService,
) {}

  ngOnInit(): void {
    this.gameSocketService.gameEnded$.subscribe(gameId => {
      this.gameId = gameId;
      this.loadGameDetails();
    });
  }

  loadGameDetails(): void {
    this.resultService.getGameDetails(this.gameId).subscribe(game => {
      this.player1 = game.player1;
      this.player2 = game.player2;
      this.winner = game.winner ? game.winner.nickname : 'Kein Gewinner';
    });
  }
  playAgain(): void {
    this.router.navigate(['/matchmaking']);
  }
}
