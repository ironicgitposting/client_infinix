import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPanelComponent } from './admin-panel/adminPanel.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: AuthenticationComponent },
  { path: 'users', component: LayoutComponent },
  { path: 'dashboard', component: LayoutComponent },
  { path: 'parc', component: LayoutComponent },
  { path: 'loan', component: LayoutComponent },
  { path: 'admin', component: AdminPanelComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
