import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, throwError, tap, flatMap } from 'rxjs';
import { Router } from '@angular/router';
import { UserDto } from '../DTOs/userDto';
import { CookieService } from 'ngx-cookie-service';
import * as crypto from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';
  private user: UserDto = {
    id: '',
    nickname: '',
    score: 0,
    img: '',
    isAdmin: false
  };

  constructor(
    private http: HttpClient, 
    private router: Router,
    private cookieService: CookieService
  ) {}

  signIn(nickname: string, password: string): Observable<any> {
    console.log('nick: ', nickname, 'pw: ', password)
    const pw = crypto.SHA256(password).toString(crypto.enc.Hex);
    return this.http.post<UserDto>(`${this.apiUrl}/login`, { nickname: nickname, password: pw }, {withCredentials: true}).pipe(
      tap(response => {
        this.setCurrentUser(response);
        console.log(this.user);
      }),
      catchError((error) => {
        console.error('Anmeldung fehlgeschlagen', error);
        return throwError(() => new Error('Anmeldung fehlgeschlagen'));
      })
    );
  }

  signOut(): Observable<any> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/logout`, {}, {withCredentials: true}).pipe(
      catchError((error) => {
        console.error('Abmeldung fehlgeschlagen', error);
        return throwError(() => new Error('Abmeldung fehlgeschlagen'));
      }),
      tap(() => {
        this.user = {
          id: '',
          nickname: '',
          score: 0,
          img: '',
          isAdmin: false
        };
        localStorage.removeItem('adminNickname');
        this.router.navigate(['/login']); // Weiterleitung zur Login-Seite
      })
    );
  }

  setCurrentUser(user: UserDto): void {
    this.user = user;
    
    
    localStorage.setItem('adminNickname', user.nickname);
  }

  isAdmin(): boolean {
    return this.user.isAdmin || localStorage.getItem('adminNickname') === 'admin';
  }

  getAdminNickname(): string | null {
    return this.user.nickname || localStorage.getItem('adminNickname');
  }

  getUser(): UserDto {
    return this.user;
  }
}
