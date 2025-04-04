import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from './auth.guard';
import { FormBuilderComponent } from './form-builder/form-builder.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'form-builder', component: FormBuilderComponent, canActivate: [authGuard] },
  //   { path: 'fill-form/:id', component: FormSubmitComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
];
