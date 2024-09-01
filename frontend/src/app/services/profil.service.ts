import { Injectable } from '@angular/core';
import { of } from 'rxjs';

const mockPlayerStats = {
  firstName: 'Max',
  lastName: 'Mustermann',
  wins: 10,
  losses: 5,
  elo: 1200,
};

const mockGameHistory = [
  { id: 1, opponent: 'Player A', result: 'Win', date: '2024-08-01' },
  { id: 2, opponent: 'Player B', result: 'Loss', date: '2024-08-02' },
  { id: 3, opponent: 'Player C', result: 'Win', date: '2024-08-03' },
];


@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor() {}

  getPlayerStats() {
    // Return the mock player stats as an observable
    return of(mockPlayerStats);
  }

  getGameHistory() {
    // Return the mock game history as an observable
    return of(mockGameHistory);
  }

  changePassword(newPassword: string) {
    // Mock implementation of changing the password
    return of(true); // Simulate successful password change
  }
}
