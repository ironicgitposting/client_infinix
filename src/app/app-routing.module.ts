import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPanelComponent } from './admin-panel/adminPanel.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { LayoutComponent } from './layout/layout.component';
import { AuthGuard } from './authentication/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: AuthenticationComponent },
  { path: 'users', component: LayoutComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: LayoutComponent, canActivate: [AuthGuard] },
  { path: 'parc', component: LayoutComponent, canActivate: [AuthGuard] },
  { path: 'loan', component: LayoutComponent, canActivate: [AuthGuard] },
  { path: 'site', component: LayoutComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: LayoutComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
