import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResultService {
  private gameApiUrl = 'http://localhost:3000/game';

  constructor(private http: HttpClient) {}

  getGameDetails(gameId: number): Observable<any> {  // Anpassen: URL und GET-Methode anpassen
    return this.http.get<any>(`${this.gameApiUrl}/${gameId}`);
  }
}
