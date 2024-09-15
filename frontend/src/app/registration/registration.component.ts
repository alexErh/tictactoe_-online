import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistrationService } from '../services/registration.service';

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

  constructor(
    private router: Router,
    private registrationService: RegistrationService
  ) {}

  private checkUsernameAvailability(nickname: string): boolean {
    const existingNicknames = ['user1', 'user2'];
    return !existingNicknames.includes(nickname);
  }

  onSubmit(form: NgForm) {
    if (!this.nickname.trim()){
      alert('Geben Sie ein Nutzername ein.')
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Die Passwörter stimmen nicht überein.');
      return;
    }

    if (this.nickname && this.password) {
      this.registrationService.signup(this.nickname, this.password).subscribe(res => {
        if (res) {
          alert('Registrierung erfolgreich!');
      
          this.clearForm();
          this.router.navigate(['/login']);
        } else {
          alert('fehler');
        }
      })
      
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
