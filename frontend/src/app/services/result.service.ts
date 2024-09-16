import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GameStatusDto } from './game-data.service';

@Injectable({
  providedIn: 'root',
})
export class ResultService {
  private apiUrl = 'http://localhost:3000/game';

  constructor(private http: HttpClient) {}

  getGameDetails(gameId: string): Observable<GameStatusDto> {
    return this.http.get<GameStatusDto>(`${this.apiUrl}/${gameId}`);
  }
}
