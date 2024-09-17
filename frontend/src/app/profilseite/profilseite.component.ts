import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileService } from '../services/profile.service';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NavigationComponent } from '../navigation/navigation.component';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { UserDto } from '../DTOs/userDto';
import { AuthService } from '../services/auth.service';

interface PlayerStats {
  nickname: string;
  score: number;
  isAdmin: boolean;
  img: string;
  wins: number;
  losses: number;
}

@Component({
  selector: 'app-profilseite',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NavigationComponent,
    NgOptimizedImage,
  ],
  templateUrl: './profilseite.component.html',
  styleUrls: ['./profilseite.component.css'],
})
export class ProfilseiteComponent implements OnInit {

  playerStats: PlayerStats | null = null;
  gameHistory: any[] = [];
  profileForm: FormGroup;
  defaultProfileImage: string = 'assets/portrait.jpg';
  isStatsLoaded: boolean = false;
  isHistoryLoaded: boolean = false;
  isSettingsLoaded: boolean = false;
  profileImage$: Observable<string>;
  public profileService: ProfileService = inject(ProfileService);
  public user: UserDto | undefined;
  public selectedFile: File | undefined;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.profileImage$ = new Observable<string>();
    this.profileForm = this.fb.group({
      oldPassword: ['', [Validators.required,]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmation: ['', [Validators.required, Validators.minLength(6)]],
      file: [null],
    });
  }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.loadPlayerStats();
    this.loadGameHistory();
    this.loadGameStatistics();
  }

  loadPlayerStats() {
    if (this.user) {
      this.profileService.getPlayerStats(this.user.nickname).subscribe({
        next: (data: PlayerStats) => {
          this.playerStats = {
            nickname: data.nickname || '',
            score: data.score || 0,
            isAdmin: data.isAdmin || false,
            img: data.img ? URL.createObjectURL(new Blob([data.img])) : this.defaultProfileImage,
            wins: data.wins || 0,
            losses: data.losses || 0,
          };
          this.loadGameStatistics();
        },
        error: (error) => {
          console.error('Error loading player stats:', error);
          alert('Fehler beim Laden der Spielerstatistiken.');
        }
      });
    }
  }

  loadGameHistory() {
    if (this.user) {
      this.profileService.getGameHistory(this.user.nickname).subscribe({
        next: (data) => {
          this.gameHistory = data.map((game: any) => ({
            id: game.id,
            player1: game.player1.nickname,
            player2: game.player2.nickname,
            winner: game.winner,
          }));
          this.isHistoryLoaded = true;
        },
        error: (error) => {
          console.error('Error loading game history:', error);
          alert('Fehler beim Laden der Spielhistorie.');
        }
      });
    }
  }

  loadGameStatistics() {
    if (this.user) {
      this.profileService.getGameStatistics(this.user.nickname).subscribe({
        next: (stats) => {
          if (this.playerStats) {
            this.playerStats.wins = stats.wins;
            this.playerStats.losses = stats.losses;
          }
        },
        error: (error) => {
          console.error('Error loading game statistics:', error);
          alert('Fehler beim Laden der Spielstatistiken: ' + error.message);
        }
      });
    }
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
    const oldPassword = this.profileForm.value.oldPassword;
    const newPassword = this.profileForm.value.newPassword;
    const confirmation = this.profileForm.value.confirmation;

    if (this.profileForm.valid && newPassword === confirmation && this.user && this.user.nickname) {
      this.profileService.changePassword(this.user.nickname, oldPassword, newPassword).subscribe({
        next: () => {
          alert('Passwort erfolgreich geändert');
          this.profileForm.reset();
        },
        error: (error) => {
          console.error('Error changing password:', error);
          alert('Fehler beim Ändern des Passworts.');
        }
      });
    } else {
      alert('Das Formular ist ungültig oder der Benutzer ist nicht angemeldet.');
    }
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile !== undefined)
  }

  onFileUpload() {
    if (this.selectedFile) {
      this.profileService.uploadProfileImage(this.selectedFile).subscribe({
        next: () => {
          this.user = this.authService.getUser()
        },
        error: (error) => {
          console.error('Error uploading profile image:', error);
          alert('Fehler beim Hochladen des Profilbilds.');
        },
      });
    }
  }
}

