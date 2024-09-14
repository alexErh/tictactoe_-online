import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  nickname: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(form: any): void {
    if (form.valid) {
      this.authService.signIn(this.nickname, this.password).subscribe({
        next: () => {
          this.router.navigate(['/start']);
        },
        error: () => {
          this.errorMessage = 'Benutzername oder Passwort falsch. Bitte versuchen Sie es erneut.';
        }
      });
    }
  }
}
