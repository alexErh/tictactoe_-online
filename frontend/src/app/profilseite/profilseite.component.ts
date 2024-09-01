import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileService } from '../services/profile.service';
import { NgClass } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet, Routes } from '@angular/router';


@Component({
  selector: 'app-profilseite',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
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

  isStatsLoaded: boolean = false;
  isHistoryLoaded: boolean = false;
  isSettingsLoaded: boolean = false;

  public profileService: ProfileService = inject(ProfileService);

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      file: [null]
    });
  }

  ngOnInit() {
    this.loadPlayerStats();
    this.loadGameHistory();
  }

  loadPlayerStats() {
    // replace with actual service call
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

  loadGameHistory() {
    // Simulierte Daten für Spielhistorie
    this.gameHistory = [
      { id: 1, opponent: 'Spieler A', result: 'Gewonnen', date: '01.01.2024' },
      { id: 2, opponent: 'Spieler B', result: 'Verloren', date: '02.01.2024' },
    ];
  }
  showStats() {
    this.isStatsLoaded = !this.isStatsLoaded;
    this.isHistoryLoaded = false;
    this.isSettingsLoaded = false;
  }

  showHistory() {
    this.isHistoryLoaded = !this.isHistoryLoaded;
    this.isStatsLoaded = false;
    this.isSettingsLoaded = false;
  }

  showSettings() {
    this.isSettingsLoaded = !this.isSettingsLoaded;
    this.isStatsLoaded = false;
    this.isHistoryLoaded = false;
  }
  onPasswordChange() {
    if (this.profileForm.valid) {
      alert('Passwort erfolgreich geändert');
      this.profileForm.reset();
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
