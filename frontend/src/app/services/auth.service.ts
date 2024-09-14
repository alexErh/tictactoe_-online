import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, throwError, tap } from 'rxjs';
import { Router } from '@angular/router';
import { UserDto } from '../DTOs/userDto';  // DTO für Benutzerinformationen
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
  ) {}

  signIn(nickname: string, password: string): Observable<any> {
    const hashedPassword = crypto.SHA256(password).toString(crypto.enc.Hex);

    return this.http.post<UserDto>(`${this.apiUrl}/login`, { nickname, password: hashedPassword }).pipe(
      tap(response => {
        this.setCurrentUser(response);
      }),
      catchError((error) => {
        console.error('Login fehlgeschlagen', error);
        return throwError(() => new Error('Login fehlgeschlagen'));
      })
    );
  }

  signOut(): Observable<any> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        this.clearCurrentUser();
        this.router.navigate(['/login']);
      }),
      catchError((error) => {
        console.error('Logout fehlgeschlagen', error);
        return throwError(() => new Error('Logout fehlgeschlagen'));
      })
    );
  }

  setCurrentUser(user: UserDto): void {
    this.user = user;
  }

  getUser(): UserDto {
    return this.user;
  }

  clearCurrentUser(): void {
    this.user = {
      id: '',
      nickname: '',
      score: 0,
      img: '',
      isAdmin: false
    };
  }

  isAdmin(): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/users/isAdmin/${this.user.nickname}`).pipe(
      catchError((error) => {
        console.error('Admin-Überprüfung fehlgeschlagen', error);
        return of(false);
      })
    );
  }
}
