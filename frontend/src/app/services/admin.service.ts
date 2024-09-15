import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private usersApiUrl = 'http://localhost:3000/users';
  private gamesApiUrl = 'http://localhost:3000/game';

  constructor(private http: HttpClient) {}

  getUsers(nickname: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.usersApiUrl}/all/${nickname}`, {withCredentials: true});
  }

  getGames(nickname: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.gamesApiUrl}/active/${nickname}`, {withCredentials: true});
  }

  getQueue(nickname: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.gamesApiUrl}/waiting/${nickname}`, {withCredentials: true});
  }
}
