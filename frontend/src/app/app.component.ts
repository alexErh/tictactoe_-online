import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import {StartseiteComponent} from './startseite/startseite.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RegistrationComponent, LoginComponent , StartseiteComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
