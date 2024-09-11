import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  nickname: string = '';
  password: string = '';

  constructor(private router: Router) {}

  onLogin(form: any) {
    if (form.valid) {
      const validUser = 'Dunia';
      const validPassword = 'Dunia';

      if (this.nickname === validUser && this.password === validPassword) {
        this.clearForm();
        this.router.navigate(['/start']);
      } else {
        alert('Benutzername oder Passwort falsch. Bitte versuchen Sie es erneut.');
      }
    }
  }

  clearForm() {
    this.nickname = '';
    this.password = '';
  }
}
