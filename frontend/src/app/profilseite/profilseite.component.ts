import { Component, OnInit } from '@angular/core';
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
  styleUrl: './profilseite.component.css'
})
export class ProfilseiteComponent implements OnInit {
  playerStats: any;
  gameHistory: any[] = [];
  profileForm: FormGroup;
  uploadProgress: number = 0;
  profileImage: string | null = null;
  defaultProfileImage: string = 'assets/portrait.jpg';

  constructor(private profileService: ProfileService, private fb: FormBuilder) {
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
    this.profileService.getPlayerStats().subscribe(stats => {
      this.playerStats = stats;
      this.profileImage = stats.profileImageUrl;
    });
  }

  loadGameHistory() {
    this.profileService.getGameHistory().subscribe(history => {
      this.gameHistory = history;
    });
  }

  onPasswordChange() {
    if (this.profileForm.valid) {
      this.profileService.changePassword(this.profileForm.value.password).subscribe(() => {
        alert('Password changed successfully');
      });
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.profileService.uploadProfileImage(file).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round((event.loaded / event.total) * 100);
        } else if (event.type === HttpEventType.Response) {
          this.profileImage = URL.createObjectURL(file);
          this.uploadProgress = 0;
        }
      });
    }
  }
}
