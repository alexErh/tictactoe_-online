import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, throwError, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';
  private user = { nickname: '', isLoggedIn: false, isAdmin: false };

  constructor(private http: HttpClient, private router: Router) {}

  signIn(nickname: string, password: string): Observable<any> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/login`, { username: nickname, password }).pipe(
      tap(response => {
        this.setCurrentUser(nickname, response.message.includes('admin'));
      }),
      catchError((error) => {
        console.error('Anmeldung fehlgeschlagen', error);
        return throwError(() => new Error('Anmeldung fehlgeschlagen'));
      })
    );
  }

  signOut(): Observable<any> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/logout`, {}).pipe(
      catchError((error) => {
        console.error('Abmeldung fehlgeschlagen', error);
        return throwError(() => new Error('Abmeldung fehlgeschlagen'));
      }),
      tap(() => {
        this.user = { nickname: '', isLoggedIn: false, isAdmin: false };
        localStorage.removeItem('adminNickname');
        this.router.navigate(['/login']); // Weiterleitung zur Login-Seite
      })
    );
  }

  setCurrentUser(nickname: string, isAdmin: boolean): void {
    this.user = { nickname, isLoggedIn: true, isAdmin };
    localStorage.setItem('adminNickname', nickname);
  }

  isAdmin(): boolean {
    return this.user.isAdmin || localStorage.getItem('adminNickname') === 'admin';
  }

  getAdminNickname(): string | null {
    return this.user.nickname || localStorage.getItem('adminNickname');
  }

}
