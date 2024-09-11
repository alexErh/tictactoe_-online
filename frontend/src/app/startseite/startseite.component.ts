import { Component } from '@angular/core';
import {Router} from "@angular/router";
import { NavigationComponent } from '../navigation/navigation.component';

@Component({
  selector: 'app-startseite',
  standalone: true,
  imports: [
    NavigationComponent,
  ],
  templateUrl: './startseite.component.html',
  styleUrl: './startseite.component.css'
})
export class StartseiteComponent {
  playerElo: number = 1000; // Initiale Elo-Zahl

  constructor(private router: Router) {}

  // Methode zum Behandeln des "Jetzt Spielen"-Buttons
  playNow(): void {
    // Hier können Sie eine Methode hinzufügen, um den Spieler zur Matchmaking-Queue hinzuzufügen
    console.log("Spieler in die Matchmaking-Queue eingetreten.");
    // Weiterleitung zur Spielseite
    this.router.navigate(['/matchmaking']);
  }
}
