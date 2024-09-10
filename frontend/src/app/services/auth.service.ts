//Beispielhafte Service für Authentifizierung bitte anpassen die Methodennamen bleiben bitte unverändert
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user = { nickname: 'defaultUser', isLoggedIn: false, isAdmin: false };

  constructor() {}

  isAdmin(): boolean {
    return this.user.isAdmin;
  }
}
