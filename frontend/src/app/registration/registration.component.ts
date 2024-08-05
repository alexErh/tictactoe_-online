import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    FormsModule,
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  firstName: string = '';
  lastName: string = '';
  username: string = '';
  password: string = '';

  // Dummy method to simulate unique username check
  private checkUsernameAvailability(username: string): boolean {
    const existingUsernames = ['user1', 'user2']; // Example existing usernames
    return !existingUsernames.includes(username);
  }

  onSubmit(form: NgForm) {
    if (!this.checkUsernameAvailability(this.username)) {
      alert('Benutzername bereits vergeben. Bitte wählen Sie einen anderen.');
      this.username = '';
      return;

    }

    if (this.firstName && this.lastName && this.username && this.password) {
      console.log('Registrierung erfolgreich:', {
        firstName: this.firstName,
        lastName: this.lastName,
        username: this.username,
        password: this.password
      });
      alert('Registrierung erfolgreich!');

      form.reset();
      this.firstName = '';
      this.lastName = '';
      this.username = '';
      this.password = '';
    } else {
      alert('Bitte füllen Sie alle Felder aus.');
    }
  }
}
