import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { AuthService } from '../services/auth.service';
import { NavigationComponent } from '../navigation/navigation.component';
import { NgClass } from '@angular/common'; // AuthService importieren

@Component({
  selector: 'app-admin',
  standalone: true,
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  imports: [
    NavigationComponent,
    NgClass,
  ],
})
export class AdminComponent implements OnInit {
  users: any[] = [];
  games: any[] = [];
  queue: any[] = [];
  adminNickname: string | null = null;
  isPlayersVisible = true;
  isGamesVisible = false;
  isQueueVisible = false;

  constructor(
    private adminService: AdminService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.adminNickname = this.authService.getAdminNickname();
    if (this.adminNickname) {
      this.loadUsers();
      this.loadGames();
      this.loadQueue();
    } else {
      console.error('Admin nickname is not available.');
    }
  }

  togglePlayers() {
    this.isPlayersVisible = !this.isPlayersVisible;
    this.isGamesVisible = false; // Schließt andere Abschnitte
    this.isQueueVisible = false;
  }

  toggleGames() {
    this.isGamesVisible = !this.isGamesVisible;
    this.isPlayersVisible = false; // Schließt andere Abschnitte
    this.isQueueVisible = false;
  }

  toggleQueue() {
    this.isQueueVisible = !this.isQueueVisible;
    this.isPlayersVisible = false;
    this.isGamesVisible = false;
  }

  loadUsers(): void {
    if (this.adminNickname) {
      this.adminService.getUsers(this.adminNickname).subscribe({
        next: (data) => {
          this.users = data;
        },
        error: (err) => {
          console.error('Failed to load users:', err);
        },
      });
    }
  }

  loadGames(): void {
    if (this.adminNickname) {
      this.adminService.getGames(this.adminNickname).subscribe({
        next: (data) => {
          this.games = data;
        },
        error: (err) => {
          console.error('Failed to load games:', err);
        },
      });
    }
  }

  loadQueue(): void {
    if (this.adminNickname) {
      this.adminService.getQueue(this.adminNickname).subscribe({
        next: (data) => {
          this.queue = data;
        },
        error: (err) => {
          console.error('Failed to load queue:', err);
        },
      });
    }
  }
}
