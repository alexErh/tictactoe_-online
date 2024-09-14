import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  users: any[] = [];
  games: any[] = [];
  queue: any[] = [];
  adminNickname: string | null = null;

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    // Überprüfe, ob der angemeldete Benutzer ein Admin ist
    const isAdmin = this.authService.isAdmin();
    if (isAdmin) {
      const currentUser = this.authService.getUser();
      const nickname = currentUser.nickname;

      if (nickname) {
        this.adminNickname = nickname;

        this.loadUsers();
        this.loadGames();
        this.loadQueue();
      } else {
        console.error('Nickname not found in AuthService');
      }
    } else {
      console.error('User is not an admin');
    }
  }

  loadUsers(): void {
    if (this.adminNickname) {
      this.adminService.getUsers(this.adminNickname).subscribe({
        next: (data) => {
          this.users = data;
        },
        error: (err: any) => {
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
        error: (err : any) => {
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
        error: (err : any) => {
          console.error('Failed to load queue:', err);
        },
      });
    }
  }
}
