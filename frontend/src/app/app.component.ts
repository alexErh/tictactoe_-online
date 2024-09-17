import { Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { MatchmakingQueueComponent } from './matchmaking-queue/matchmaking-queue.component';
import { SpielseiteComponent } from './spielseite/spielseite.component';
import { ProfilseiteComponent } from './profilseite/profilseite.component';
import { NavigationComponent } from './navigation/navigation.component';
import {  MatchmakingQueueService } from './services/matchmaking-queue.service';
import {  ProfileService } from './services/profile.service';
import { AuthService } from './services/auth.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    RegistrationComponent, 
    LoginComponent, 
    MatchmakingQueueComponent, 
    SpielseiteComponent, 
    ProfilseiteComponent, 
    NavigationComponent,
  ],
  providers: [MatchmakingQueueService, ProfileService,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'frontend';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    setInterval(() => {
      this.authService.checkSession().subscribe(res => {
        if (!res.sessionActive)
          this.authService.signOut();
      })
    }, 2*60*1000)
  }
}
