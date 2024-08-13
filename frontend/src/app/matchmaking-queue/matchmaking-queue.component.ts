import { Component, OnInit } from '@angular/core';
import { MatchmakingQueueService } from '../services/matchmaking-queue.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WebsocketService } from '../services/websocket.service';


@Component({
  selector: 'app-matchmaking-queue',
  standalone: true,
  imports: [CommonModule],
  providers: [MatchmakingQueueService],
  templateUrl: './matchmaking-queue.component.html',
  styleUrls: ['./matchmaking-queue.component.css']
})

export class MatchmakingQueueComponent implements OnInit {
  matchFound: any;

  constructor(private webSocketService: MatchmakingQueueService,private socketService: WebsocketService, private router: Router) {}

  ngOnInit() {
    this.webSocketService.joinQueue({ username: 'Player1', elo: 1200 });

    this.webSocketService.onMatchFound().subscribe(opponent => {
      this.matchFound = opponent;
    });
  }

  startGame() {
    this.router.navigate(['/game'], { state: { opponent: this.matchFound } });
  }
}
