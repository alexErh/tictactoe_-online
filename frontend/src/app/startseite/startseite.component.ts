import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { NavigationComponent } from '../navigation/navigation.component';
import { UserDto } from '../DTOs/userDto';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-startseite',
  standalone: true,
  imports: [
    NavigationComponent,
  ],  templateUrl: './startseite.component.html',
  styleUrl: './startseite.component.css'
})
export class StartseiteComponent implements OnInit {

  public user: UserDto | undefined;
  playerElo: number = 1000;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
  }

  playNow(): void {
    console.log("Spieler in die Matchmaking-Queue eingetreten.");
    this.router.navigate(['/matchmaking']);
  }
}
