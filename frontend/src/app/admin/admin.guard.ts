import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(): boolean {
    if (this.authService.isAdmin()) {
      //this.authService.setAdminNickname('AdminUserNickname');
      return true;
    } else {
      /* throw('Sie sind kein Admin!', 'OK', {
        duration: 3000,
      }); */
      return false;
    }
  }
}

