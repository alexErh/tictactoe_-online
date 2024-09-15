import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { UserDto } from '../DTOs/userDto';
import { AuthService } from './auth.service';
import * as crypto from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getPlayerStats(nickname: string): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/users/${nickname}/stats`).pipe(
      catchError(error => {
        console.error('Error fetching player stats:', error);
        return throwError(() => new Error('Error fetching player stats'));
      })
    );
  }

  getGameHistory(nickname: string): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/game/${nickname}`).pipe(
      catchError(error => {
        console.error('Error fetching game history:', error);
        return throwError(() => new Error('Error fetching game history'));
      })
    );
  }

  getGameStatistics(nickname: string): Observable<{ wins: number; losses: number }> {
    return this.http.get<{ wins: number; losses: number }>(`http://localhost:3000/game/statistics/${nickname}`).pipe(
      catchError(error => {
        console.error('Error fetching game statistics:', error);
        return throwError(() => new Error('Error fetching game statistics: ' + (error.message || 'Unknown error')));
      })
    );
  }


  changePassword(nickname: string, oldPassword: string, newPassword: string): Observable<void> {
    const oldHash = crypto.SHA256(oldPassword).toString(crypto.enc.Hex);
    const newHash = crypto.SHA256(newPassword).toString(crypto.enc.Hex);
    return this.http.put<void>(`http://localhost:3000/users/updatePW`, { nickname: nickname, oldPW: oldHash, newPW: newHash }, {withCredentials: true}).pipe(
      catchError(error => {
        console.error('Error changing password:', error);
        return throwError(() => new Error('Error changing password'));
      })
    );
  }

  getProfileImage(nickname: string): Observable<Blob> {
    return this.http.get(`http://localhost:3000/users/${nickname}/img`, { responseType: 'blob' }).pipe(
      catchError(error => {
        console.error('Error fetching profile image:', error);
        return throwError(() => new Error('Error fetching profile image'));
      })
    );
  }

  uploadProfileImage(file: File): Observable<any> {
    const formData = new FormData();
      formData.append('img', file, file.name);

    return this.http.put<UserDto>(`http://localhost:3000/users/img/${this.authService.getUser().nickname}`, formData, {
      withCredentials: true,
    }).pipe(
      tap(user => {
          if (user)
            this.authService.setCurrentUser(user)
      }),
      catchError(error => {
        console.error('Error uploading profile image:', error);
        return throwError(() => new Error('Error uploading profile image'));
      })
    );
  }
}
