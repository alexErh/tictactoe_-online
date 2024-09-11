import { Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { MatchmakingQueueComponent } from './matchmaking-queue/matchmaking-queue.component';
import { SpielseiteComponent } from './spielseite/spielseite.component';
import { ProfilseiteComponent } from './profilseite/profilseite.component';
import { NavigationComponent } from './navigation/navigation.component';
import {  MatchmakingQueueService } from './services/matchmaking-queue.service';
import {  ProfileService } from './services/profile.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RegistrationComponent, LoginComponent, MatchmakingQueueComponent, SpielseiteComponent, ProfilseiteComponent, NavigationComponent,],
  providers: [MatchmakingQueueService, ProfileService,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
