import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPanelComponent } from './admin-panel/adminPanel.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { LayoutComponent } from './layout/layout.component';
import { AuthGuard } from './authentication/auth.guard';
import { ResetPasswordMailComponent } from './reset-password-mail/reset-password-mail.component';
import { ResetPasswordFormComponent } from './reset-password-form/reset-password-form.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: AuthenticationComponent },
  { path: 'users', component: LayoutComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: LayoutComponent, canActivate: [AuthGuard] },
  { path: 'parc', component: LayoutComponent, canActivate: [AuthGuard] },
  { path: 'loan', component: LayoutComponent, canActivate: [AuthGuard] },
  { path: 'site', component: LayoutComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: LayoutComponent, canActivate: [AuthGuard] },
  { path: 'resetPassword', component: ResetPasswordMailComponent },
  { path: 'reset/:id/:token', component: ResetPasswordFormComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
