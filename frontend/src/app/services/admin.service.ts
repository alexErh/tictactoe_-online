import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:3000/admin';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }

  getGames(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/games`);
  }

  getQueue(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/queue`);
  }
}
