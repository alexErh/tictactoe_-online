import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    FormsModule,
  ],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  nickname: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private router: Router) {}

  private checkUsernameAvailability(nickname: string): boolean {
    const existingNicknames = ['user1', 'user2'];
    return !existingNicknames.includes(nickname);
  }

  onSubmit(form: NgForm) {
    if (!this.checkUsernameAvailability(this.nickname)) {
      alert('Benutzername bereits vergeben. Bitte wählen Sie einen anderen.');
      this.nickname = '';
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Die Passwörter stimmen nicht überein.');
      return;
    }

    if (this.nickname && this.password) {
      alert('Registrierung erfolgreich!');
      this.clearForm();
      this.router.navigate(['/login']);
    } else {
      alert('Bitte füllen Sie alle Felder aus.');
    }
  }

  clearForm() {
    this.nickname = '';
    this.password = '';
    this.confirmPassword = '';
  }
}
