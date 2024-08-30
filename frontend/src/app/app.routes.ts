import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import {StartseiteComponent} from './startseite/startseite.component' ;
import { ResultatComponent } from './resultat/resultat.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [

  { path: 'register', component: RegistrationComponent },
  { path: 'login', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'start', component: StartseiteComponent },
  { path: 'result', component: ResultatComponent } ,
  { path: '', redirectTo: '/login', pathMatch: 'full' }


];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
