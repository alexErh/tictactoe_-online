import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://localhost:3000/profil';
  constructor(private http: HttpClient, private authService: AuthService) { }

  getPlayerStats(): Observable<any> {
    const nickname = this.authService.getCurrentUser().nickname; // Holen Sie sich den Nickname des aktuellen Benutzers
    return this.http.get<any>(`${this.apiUrl}/stats/${nickname}`).pipe(
      catchError(error => {
        console.error('Error fetching player stats:', error);
        return throwError(() => new Error('Error fetching player stats'));
      })
    );
  }

  getGameHistory(): Observable<any[]> {
    const nickname = this.authService.getCurrentUser().nickname;
    return this.http.get<any[]>(`${this.apiUrl}/history/${nickname}`).pipe(
      catchError(error => {
        console.error('Error fetching game history:', error);
        return throwError(() => new Error('Error fetching game history'));
      })
    );
  }

  getGameStatistics(): Observable<{ wins: number; losses: number }> {
    const nickname = this.authService.getCurrentUser().nickname;
    return this.http.get<{ wins: number; losses: number }>(`${this.apiUrl}/statistics/${nickname}`).pipe(
      catchError(error => {
        console.error('Error fetching game statistics:', error);
        return throwError(() => new Error('Error fetching game statistics'));
      })
    );
  }

  getProfileImage(nickname: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/profile-image/${nickname}`, { responseType: 'blob' }).pipe(
      catchError(error => {
        console.error('Error fetching profile image:', error);
        return throwError(() => new Error('Error fetching profile image'));
      })
    );
  }

  changePassword(newPassword: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/change-password`, { password: newPassword }).pipe(
      catchError(error => {
        console.error('Error changing password:', error);
        return throwError(() => new Error('Error changing password'));
      })
    );
  }

  uploadProfileImage(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/upload-image`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      catchError(error => {
        console.error('Error uploading profile image:', error);
        return throwError(() => new Error('Error uploading profile image'));
      })
    );
  }

}
