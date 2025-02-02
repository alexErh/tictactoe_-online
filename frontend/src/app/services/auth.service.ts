import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, throwError, tap, flatMap } from 'rxjs';
import { Router } from '@angular/router';
import { UserDto } from '../DTOs/userDto';
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
    private router: Router
  ) {
    const data = localStorage.getItem('user');
    if (data)
      this.user = JSON.parse(data);
  }

  signIn(nickname: string, password: string): Observable<any> {
    const pw = crypto.SHA256(password).toString(crypto.enc.Hex);
    return this.http.post<UserDto>(`${this.apiUrl}/login`, { nickname: nickname, password: pw }, {withCredentials: true}).pipe(
      tap(response => {
        this.setCurrentUser(response);
      }),
      catchError((error) => {
        console.error('Anmeldung fehlgeschlagen', error);
        return throwError(() => new Error('Anmeldung fehlgeschlagen'));
      })
    );
  }

  signInWithSession() {
    this.http.get<UserDto>(`${this.apiUrl}/me`, {withCredentials: true}).subscribe({
      next: (data) => {
        this.user = data;
        this.router.navigate(['/start'])
      }
    })
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
        this.router.navigate(['/login']);
      })
    );
  }

  checkSession() {
    return this.http.get<{ sessionActive: boolean }>(`${this.apiUrl}/session-status`, {withCredentials: true});
  }

  setCurrentUser(user: UserDto): void {
    this.user = user;

    localStorage.setItem('user', JSON.stringify(user))
  }

  isAdmin(): boolean {
    return this.isUserLogged() && this.user.isAdmin;
  }

  isUserLogged(): boolean {
    sessionStorage.getItem
    return this.user.nickname.length !== 0;
  }

  getAdminNickname(): string | null {
    return this.user.nickname;
  }

  getUser(): UserDto {
    return this.user;
  }

  refresh() {
    this.signInWithSession();
  }
}
