import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { MatchmakingQueueComponent } from './matchmaking-queue/matchmaking-queue.component';
import { SpielseiteComponent } from './spielseite/spielseite.component';
import { ProfilseiteComponent } from './profilseite/profilseite.component';
import { StartseiteComponent } from './startseite/startseite.component';
import { AdminComponent } from './admin/admin.component';
import { AdminGuard } from './helpers/guards/admin.guard';
import { ResultsComponent } from './results/results.component';
import { AuthGuard } from './helpers/guards/auth.guard';

export const routes: Routes = [
  { path: 'register', component: RegistrationComponent },
  { path: 'login', component: LoginComponent },
  { path: 'start', component: StartseiteComponent, canActivate: [AuthGuard]},
  { path: 'matchmaking', component: MatchmakingQueueComponent, canActivate: [AuthGuard] },
  { path: 'game', component: SpielseiteComponent, canActivate: [AuthGuard] },
  { path: 'profil', component: ProfilseiteComponent, canActivate: [AuthGuard] },
  { path: 'results', component: ResultsComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
