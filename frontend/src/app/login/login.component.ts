import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    NgClass,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  onLogin(form: any) {
    if (form.valid) {
      // Dummy Login Logic: Replace this with actual login logic
    const validUser = 'testuser';
    const validPassword = 'testuser';

    if (this.username === validUser && this.password === validPassword) {
      // Successful login
      alert('Erfolgreich angemeldet!');
      this.clearForm();
    } else {
      // Failed login
      alert('Benutzername oder Passwort falsch. Bitte versuchen Sie es erneut.');
    }
  }
}

clearForm() {
  this.username = '';
  this.password = '';
}
}
