import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationComponent } from './authentication/authentication.component';
import { UsersListComponent } from './users-list/usersList.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VehiclesListComponent } from './vehicles-list/vehicles-list.component';
import { LayoutComponent } from './layout/layout.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: AuthenticationComponent },
  { path: 'users', component: LayoutComponent },
  { path: 'dashboard', component: LayoutComponent },
  { path: 'parc', component: LayoutComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
