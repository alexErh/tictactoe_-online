import { Component, OnInit} from '@angular/core';
import { NavigationComponent } from '../navigation/navigation.component';
import { ResultService } from '../services/result.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [
    NavigationComponent,
  ],
  templateUrl: './results.component.html',
  styleUrl: './results.component.css'
})
export class ResultsComponent implements OnInit {

  winner: string = '';
  player1: any;
  player2: any;
  gameId: number = 0; //anpassen mitteilung des Ids vom server nach dem Spielende

  constructor(
    private router: Router,
    private resultService: ResultService,
  ) {}

  ngOnInit(): void {
      this.loadGameDetails();
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
