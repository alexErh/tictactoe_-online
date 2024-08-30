import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-resultat',
  standalone: true,
  imports: [],
  templateUrl: './resultat.component.html',
  styleUrl: './resultat.component.css'
})
export class ResultatComponent {
  playerX = { eloRating: 1500, kFactor: 30 }; // Sample initial Elo rating
  playerO = { eloRating: 1500, kFactor: 30 }; // Sample initial Elo rating
  winner: string | null = null;

  constructor(private router: Router) {
    // Simulate setting the winner and calculating Elo for demo purposes
    this.winner = 'X'; // Or 'O' or null if it's a draw
    this.calculateElo();
  }

  calculateElo(): void {
    const result = this.winner === 'X' ? 1 : this.winner === 'O' ? 0 : 0.5;

    // Calculate expected scores
    const expectedScoreX = 1 / (1 + Math.pow(10, (this.playerO.eloRating - this.playerX.eloRating) / 400));
    const expectedScoreO = 1 / (1 + Math.pow(10, (this.playerX.eloRating - this.playerO.eloRating) / 400));

    // Update Elo ratings
    this.playerX.eloRating = this.playerX.eloRating + this.playerX.kFactor * (result - expectedScoreX);
    this.playerO.eloRating = this.playerO.eloRating + this.playerO.kFactor * ((1 - result) - expectedScoreO);
  }
  backToHome(): void {
    this.router.navigate(['/home']);
  }
}
