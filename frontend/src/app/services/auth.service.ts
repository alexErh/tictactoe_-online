//Beispielhafte Service für Authentifizierung bitte anpassen die Methodennamen bleiben bitte unverändert
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user = { nickname: 'defaultUser', isLoggedIn: false, isAdmin: false };

  constructor() {}

  getCurrentUser(): { nickname: string; isAdmin: boolean } {
    if (this.user.isLoggedIn) {
      return { nickname: this.user.nickname, isAdmin: this.user.isAdmin };
    } else {
      throw new Error('No user is currently logged in.');
    }
  }

  isAdmin(): boolean {
    return this.user.isAdmin;
  }
}
