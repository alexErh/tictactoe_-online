import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileService } from '../services/profile.service';
import { HttpEventType } from '@angular/common/http';


@Component({
  selector: 'app-profilseite',
  standalone: true,
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './profilseite.component.html',
  styleUrls: ['./profilseite.component.css']
})
export class ProfilseiteComponent implements OnInit {
  playerStats: any;
  gameHistory: any[] = [];
  profileForm: FormGroup;
  uploadProgress: number = 0;
  profileImage: string | null = null;
  defaultProfileImage: string = 'assets/portrait.jpg';

  // Kontrollvariable für die Anzeige der Abschnitte
  isStatsLoaded: boolean = false;
  isHistoryLoaded: boolean = false;
  isSettingsLoaded: boolean = false;

  public profileService: ProfileService = inject(ProfileService);

  constructor( private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      file: [null]
    });
  }

  ngOnInit() {
    this.loadPlayerStats();
  }


  loadPlayerStats() {
    // Simulate loading player stats (replace with actual service call if needed)
    this.playerStats = {
      firstName: 'Max',
      lastName: 'Mustermann',
      wins: 10,
      losses: 5,
      elo: 1200,
      profileImageUrl: null
    };
    this.profileImage = this.playerStats.profileImageUrl || this.defaultProfileImage;
  }

  showStats() {
    this.isStatsLoaded = true;
    this.isHistoryLoaded = false; // Close history section
    this.isSettingsLoaded = false; // Close settings section
  }

  showHistory() {
    this.isHistoryLoaded = true;
    this.isStatsLoaded = false; // Close stats section
    this.isSettingsLoaded = false; // Close settings section
  }

  showSettings() {
    this.isSettingsLoaded = true;
    this.isStatsLoaded = false; // Close stats section
    this.isHistoryLoaded = false; // Close history section
  }

  onPasswordChange() {
    if (this.profileForm.valid) {
      alert('Passwort erfolgreich geändert');
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadProgress = 100;
      this.profileImage = URL.createObjectURL(file);
    }
  }

  trackGameById(index: number, game: any): number {
    return game.id;
  }
}
