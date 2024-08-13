import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { MatchmakingQueueComponent } from './matchmaking-queue/matchmaking-queue.component';
import { SpielseiteComponent } from './spielseite/spielseite.component';
import { ProfilseiteComponent } from './profilseite/profilseite.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RegistrationComponent, LoginComponent, MatchmakingQueueComponent, SpielseiteComponent, ProfilseiteComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
