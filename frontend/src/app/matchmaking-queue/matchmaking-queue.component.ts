import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatchmakingQueueService } from '../services/matchmaking-queue.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Player } from '../models/player.model';

@Component({
  selector: 'app-matchmaking-queue',
  standalone: true,
  imports: [CommonModule],
  providers: [MatchmakingQueueService],
  templateUrl: './matchmaking-queue.component.html',
  styleUrls: ['./matchmaking-queue.component.css'],
})
export class MatchmakingQueueComponent implements OnInit, OnDestroy  {
  matchFound: Player | null = null;
  waiting: boolean = false;

  constructor(
    private matchmakingQueueService: MatchmakingQueueService,
    private router: Router
  ) {}

  ngOnInit() {
    this.joinQueue();

    this.matchmakingQueueService.onMatchFound().subscribe((opponent) => {
      if (opponent) {
        this.matchFound = opponent;
        this.waiting = false;

        setTimeout(() => {
          this.startGame();
        }, 3000);
      }
    });

  }

  ngOnDestroy() {
    this.disconnect();
  }

  joinQueue() {
    const playerData = { nickname: 'Player1', elo: 1200 };
    this.waiting = true;
    this.matchmakingQueueService.joinQueue(playerData);
  }

  confirmCancelQueue() {
    const confirmed = window.confirm('Möchtest du wirklich die Warteschlange abbrechen?');
    if (confirmed) {
      this.cancelQueue();
    }
  }

  cancelQueue() {
    this.matchmakingQueueService.cancelQueue();
    this.router.navigate(['/start']).then(() => {
      this.waiting = false;
    }).catch((error) => {
      console.error('Navigation failed:', error);
    });
  }


  disconnect() {
    this.matchmakingQueueService.disconnect();
  }

  startGame() {
    if (this.matchFound) {
      this.router.navigate(['/game'], { state: { opponent: this.matchFound } })
        .then(() => {
        })
        .catch((error) => {
          console.error('Navigation zur Spielseite fehlgeschlagen:', error);

        });
    } else {
      console.error('Kein Gegner gefunden, kann das Spiel nicht starten.');
    }
  }


}
