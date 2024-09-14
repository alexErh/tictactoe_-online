import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { AuthService } from '../services/auth.service';
import { NavigationComponent } from '../navigation/navigation.component'; // AuthService importieren

@Component({
  selector: 'app-admin',
  standalone: true,
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  imports: [
    NavigationComponent,
  ],
})
export class AdminComponent implements OnInit {
  users: any[] = [];
  games: any[] = [];
  queue: any[] = [];
  adminNickname: string | null = null;

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
