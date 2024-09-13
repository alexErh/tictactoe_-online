import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as crypto from 'crypto-js';
import { catchError, map, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(
    private http: HttpClient, 
    private router: Router,
  ) { }

  signup(nickname: string, password: string) {
    const pw = crypto.SHA256(password).toString(crypto.enc.Hex);
    console.log(pw)
    return this.http.post(`${this.apiUrl}/signup`, { nickname, password: pw}).pipe(
      map(() => true),
      catchError(() => of(false))
    )
  }
}
