import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})

export class AdminComponent implements OnInit {
  users: any[] = [];
  games: any[] = [];
  queue: any[] = [];

  constructor(
    private adminService: AdminService
  ) { }

  ngOnInit(): void {
    this.loadUsers();
    this.loadGames();
   this.loadQueue();
  }

  loadUsers(): void {
    this.adminService.getUsers().subscribe(data => {
      this.users = data;
    });
  }

  loadGames(): void {
    this.adminService.getGames().subscribe(data => {
      this.games = data;
    });
  }

  loadQueue(): void {
    this.adminService.getQueue().subscribe(data => {
      this.queue = data;
    });
  }
}
