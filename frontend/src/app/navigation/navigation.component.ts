import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    RouterLinkActive,
    RouterLink,
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent {
  constructor(private authService: AuthService) {}

  onSignOut(): void {
    this.authService.signOut().subscribe({
      next: () => {
      },
      error: (err) => {
        console.error('Fehler beim Abmelden', err);
      }
    });
  }
}
