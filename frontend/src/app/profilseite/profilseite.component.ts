import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileService } from '../services/profile.service';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { HttpEventType } from '@angular/common/http';
import { NavigationComponent } from '../navigation/navigation.component';
import { catchError, Observable, of, switchMap } from 'rxjs';

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
  uploadProgress: number = 0;
  profileImage: string | null = null;
  defaultProfileImage: string = 'assets/portrait.jpg';
  isStatsLoaded: boolean = false;
  isHistoryLoaded: boolean = false;
  isSettingsLoaded: boolean = false;
  profileImage$: Observable<string>;
  public profileService: ProfileService = inject(ProfileService);

  constructor(private fb: FormBuilder) {
    this.profileImage$ = new Observable<string>();
    this.profileForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      file: [null],
    });
  }

  ngOnInit() {
    this.loadProfileImage();
    this.loadPlayerStats();
    this.loadGameHistory();
    this.loadGameStatistics();
  }

  loadPlayerStats() {
    this.profileService.getPlayerStats().subscribe({
      next: (data: PlayerStats) => {
        this.playerStats = {
          nickname: data.nickname || '',
          score: data.score || 0,
          isAdmin: data.isAdmin || false,
          img: data.img ? URL.createObjectURL(new Blob([data.img])) : this.defaultProfileImage,
          wins: data.wins || 0,
          losses: data.losses || 0,
        };
        this.profileImage = this.playerStats.img || this.defaultProfileImage;
        this.loadGameStatistics();
      },
      error: (error) => {
        console.error('Error loading player stats:', error);
        alert('Fehler beim Laden der Spielerstatistiken.');
      }
    });
  }

  loadGameHistory() {
    this.profileService.getGameHistory().subscribe({
      next: (data) => {
        this.gameHistory = data.map((game: any) => ({
          id: game.id,
          player1: game.player1,
          player2: game.player2,
          currentTurn: game.currentTurn,
          winner: game.winner,
        }));
      },
      error: (error) => {
        console.error('Error loading game history:', error);
        alert('Fehler beim Laden der Spielhistorie.');
      }
    });
  }

  loadGameStatistics() {
    this.profileService.getGameStatistics().subscribe((stats) => {
      if (this.playerStats) {
        this.playerStats.wins = stats.wins;
        this.playerStats.losses = stats.losses;
      }
    });
  }

  loadProfileImage() {
    if (this.playerStats?.nickname) {
      this.profileImage$ = this.profileService.getProfileImage().pipe(
        switchMap((blob) => {
          const reader = new FileReader();
          return new Observable<string>(observer => {
            reader.onload = () => {
              observer.next(reader.result as string);
              observer.complete();
            };
            reader.onerror = (error) => {
              observer.error(error);
            };
            reader.readAsDataURL(blob);
          });
        }),
        catchError((error) => {
          console.error('Error loading profile image:', error);
          return of(this.defaultProfileImage);
        })
      );
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
    if (this.profileForm.valid) {
      this.profileService.changePassword(this.profileForm.value.password).subscribe({
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
      alert('Das Formular ist ungültig.');
    }
  }


  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      // FormData wird verwendet, um die Datei für die HTTP-Anfrage vorzubereiten.
      const formData = new FormData();
      formData.append('file', file);

      this.profileService.uploadProfileImage(formData).subscribe({
        next: () => {
          alert('Profilbild erfolgreich hochgeladen!');
        },
        error: (error) => {
          console.error('Error uploading profile image:', error);
          alert('Fehler beim Hochladen des Profilbilds.');
        },
      });
    }
  }
}

