import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(): boolean {

    console.log(this.authService.getUser())
    if (this.authService.isAdmin())
      return true;

    this.router.navigate(['/start'])
    alert('Sie haben keine Admin-Berechtigungen');
    return false;

  }
}

