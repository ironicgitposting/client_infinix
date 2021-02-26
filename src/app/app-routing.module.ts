import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationComponent } from './authentication/authentication.component';
import { UsersListComponent } from './users-list/usersList.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VehiclesListComponent } from './vehicles-list/vehicles-list.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: AuthenticationComponent },
  { path: 'users', component: UsersListComponent },
  { path: 'dashboard', component: DashboardComponent},
  { path: 'vehicleslist', component: VehiclesListComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
