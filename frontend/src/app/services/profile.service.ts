import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://localhost:3000/profil';

  constructor(private http: HttpClient) { }

  getPlayerStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`).pipe(
      catchError(error => {
        console.error('Error fetching player stats:', error);
        return throwError(() => new Error('Error fetching player stats'));
      })
    );
  }

  getGameHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/history`).pipe(
      catchError(error => {
        console.error('Error fetching game history:', error);
        return throwError(() => new Error('Error fetching game history'));
      })
    );
  }

  changePassword(nickname: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/change-password`, { nickname, password: newPassword }).pipe(
      catchError(error => {
        console.error('Error changing password:', error);
        return throwError(() => new Error('Error changing password'));
      })
    );
  }

  uploadProfileImage(file: File, nickname: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('nickname', nickname);

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
  getProfileImage(nickname: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/profile-image/${nickname}`, { responseType: 'blob' }).pipe(
      catchError(error => {
        console.error('Error fetching profile image:', error);
        return throwError(() => new Error('Error fetching profile image'));
      })
    );
  }
}
