import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class GameDataService {
  httpClient: HttpClient = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/game';
  constructor() { }

  createGame(player1: string, player2: string) {
    return this.httpClient.post(`${this.apiUrl}/create`, {player1, player2});
  }
}
