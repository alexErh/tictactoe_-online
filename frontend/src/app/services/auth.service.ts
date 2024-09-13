import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, throwError, tap, flatMap } from 'rxjs';
import { Router } from '@angular/router';
import { UserDto } from '../DTOs/userDto';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';
  private user: UserDto = {
    isLoggedIn: false,
    user: {
      id: '',
      nickname: '',
      score: 0,
      img: '',
      isAdmin: false
    }
  };

  constructor(
    private http: HttpClient, 
    private router: Router,
    private cookieService: CookieService
  ) {}

  signIn(nickname: string, password: string): Observable<any> {
    return this.http.post<UserDto>(`${this.apiUrl}/login`, { nickname, password }).pipe(
      tap(response => {
        console.log('singIn', nickname)
        console.log('res', response)
        console.log('cookie', document.cookie)
        this.cookieService.set('authCookie', nickname);
        this.setCurrentUser(response);
      }),
      catchError((error) => {
        console.error('Anmeldung fehlgeschlagen', error);
        return throwError(() => new Error('Anmeldung fehlgeschlagen'));
      })
    );
  }

  signOut(): Observable<any> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/logout`, {sessionStorage}).pipe(
      catchError((error) => {
        console.error('Abmeldung fehlgeschlagen', error);
        return throwError(() => new Error('Abmeldung fehlgeschlagen'));
      }),
      tap(() => {
        this.user = {
          isLoggedIn: false,
          user: {
            id: '',
            nickname: '',
            score: 0,
            img: '',
            isAdmin: false
          }
        };
        localStorage.removeItem('adminNickname');
        this.router.navigate(['/login']); // Weiterleitung zur Login-Seite
      })
    );
  }

  setCurrentUser(user: UserDto): void {
    this.user = user;
    
    console.log('setCUrrentUser', user.user.nickname)

    sessionStorage.setItem('nickname', user.user.nickname);
    sessionStorage.setItem('isAdmin', user.user.isAdmin ? 'admin' : 'user');
    sessionStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('adminNickname', user.user.nickname);
  }

  isAdmin(): boolean {
    return this.user.user.isAdmin || localStorage.getItem('adminNickname') === 'admin';
  }

  getAdminNickname(): string | null {
    return this.user.user.nickname || localStorage.getItem('adminNickname');
  }

  getUser(): UserDto {
    return this.user;
  }
}
