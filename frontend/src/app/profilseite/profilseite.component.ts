import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileService } from '../services/profile.service';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet,  } from '@angular/router';
import { HttpEventType } from '@angular/common/http';
import { NavigationComponent } from '../navigation/navigation.component';
import { catchError, fromEvent, map, Observable, of, switchMap } from 'rxjs';

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
  playerStats: any;
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
    this.loadPlayerStats();
    this.loadGameHistory();
    this.loadProfileImage(this.playerStats.nickname);

  }

  loadPlayerStats() {
    this.profileService.getPlayerStats().subscribe((data) => {
      this.playerStats = {
        nickname: data.nickname,
        score: data.score,
        isAdmin: data.isAdmin,
        img: data.nickname ? URL.createObjectURL(new Blob([data.img])) : this.defaultProfileImage,
      };
      this.profileImage = this.playerStats.img || this.defaultProfileImage;
      if (this.playerStats.nickname) {
        this.loadProfileImage(this.playerStats.nickname);
      }
    });
  }

  loadProfileImage(nickname: string) {
    this.profileImage$ = this.profileService.getProfileImage(nickname).pipe(
      switchMap(blob => {
        const reader = new FileReader();
        const fileRead$ = fromEvent(reader, 'load').pipe(
          map(() => reader.result as string)
        );
        reader.readAsDataURL(blob);
        return fileRead$;
      }),
      catchError(error => {
        console.error('Error loading profile image:', error);
        return of(this.defaultProfileImage);
      })
    );
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
          board: game.board,
          date: game.date,
        }));
      },
      error: (error) => {
        console.error('Error loading game history:', error);
        alert('Fehler beim Laden der Spielhistorie.');
      }
    });
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
      const nickname = this.playerStats?.nickname;
      if (nickname) {
        this.profileService.changePassword(nickname, this.profileForm.value.password).subscribe({
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
        alert('Nickname ist nicht verfügbar.');
      }
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.profileImage = URL.createObjectURL(file);
      this.uploadProgress = 0;
      const nickname = this.playerStats?.nickname;
      if (nickname) {
        this.profileService.uploadProfileImage(file, nickname).subscribe({
          next: (event) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.uploadProgress = Math.round((100 * event.loaded) / (event.total || 1));
            } else if (event.type === HttpEventType.Response) {
              alert('Profilbild erfolgreich hochgeladen!');
              this.uploadProgress = 100;
            }
          },
          error: (error) => {
            console.error('Error uploading profile image:', error);
            alert('Fehler beim Hochladen des Profilbilds.');
            this.uploadProgress = 0;
          },
        });
      } else {
        alert('Nickname ist nicht verfügbar.');
      }
    }
  }

}
