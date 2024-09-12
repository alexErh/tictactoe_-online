import { Component } from '@angular/core';
import {Router} from "@angular/router";
import { NavigationComponent } from '../navigation/navigation.component';

@Component({
  selector: 'app-startseite',
  standalone: true,
  imports: [
    NavigationComponent,
  ],  templateUrl: './startseite.component.html',
  styleUrl: './startseite.component.css'
})
export class StartseiteComponent {

  playerElo: number = 1000;

  constructor(private router: Router) {}

  playNow(): void {
    console.log("Spieler in die Matchmaking-Queue eingetreten.");
    this.router.navigate(['/matchmaking']);
  }
}
