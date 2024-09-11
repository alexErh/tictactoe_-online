import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
//import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    //private snackBar: MatSnackBar
  ) {}

  canActivate(): boolean {
    if (this.authService.isAdmin()) {
      this.router.navigate(['/admin']);
      return true;
    } else {
      //this.snackBar.open('Sie sind kein Admin!', 'OK', {
        //duration: 3000,
      //});

      return false;
    }
  }
}

