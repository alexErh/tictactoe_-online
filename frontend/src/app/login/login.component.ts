import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';  // Importiere AuthService
import { CookieService } from 'ngx-cookie-service';
import { tap } from 'rxjs';
import { UserDto } from '../DTOs/userDto';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  nickname: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService, 
    private router: Router,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    
    this.authService.signInWithSession()
    const message = localStorage.getItem('redirectionMessage');
    console.log('message1', message);
    localStorage.setItem('redirectionMessage', '');
    console.log('message2', localStorage.getItem('redirectionMessage'))
    if (message) {
      
    }
  }

  navigateTo(to: string) {
    this.router.navigate([to]);
  }

  onLogin(form: any): void {
    if (form.valid) {
      this.authService.signIn(this.nickname, this.password).subscribe({
        next: (response) => {
          const nickname = response.nickname;
          const isAdmin = response.isAdmin;

          
          this.router.navigate(['/start']);
        },
        error: (err) => {
          this.errorMessage = 'Benutzername oder Passwort falsch. Bitte versuchen Sie es erneut.';
        }
      });
    }
  }
}
