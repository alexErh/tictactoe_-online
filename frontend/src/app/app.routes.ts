import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { ResultatComponent } from './resultat/resultat.component';
import { MatchmakingQueueComponent } from './matchmaking-queue/matchmaking-queue.component';
import { SpielseiteComponent } from './spielseite/spielseite.component';
import { ProfilseiteComponent } from './profilseite/profilseite.component';
import { StartseiteComponent } from './startseite/startseite.component';
import { AdminComponent } from './admin/admin.component';
import { AdminGuard } from './admin/admin.guard';

export const routes: Routes = [
  { path: 'register', component: RegistrationComponent },
  { path: 'login', component: LoginComponent },
  { path: 'start', component: StartseiteComponent },
  { path: 'matchmaking', component: MatchmakingQueueComponent },
  { path: 'game', component: SpielseiteComponent },
  { path: 'result', component: ResultatComponent } ,
  { path: 'profil', component: ProfilseiteComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
