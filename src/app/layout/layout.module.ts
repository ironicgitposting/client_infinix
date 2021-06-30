import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { LayoutComponent } from './layout.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { HeaderModule } from '../header/header.module';
import { SidebarModule } from '../sidebar/sidebar.module';
import { DashboardModule } from '../dashboard/dashboard.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatChipsModule } from '@angular/material/chips';
import { UsersListModule } from '../users-list/usersList.module';
import { VehiclesListModule } from '../vehicles-list/vehicles-list.module';
import { BrowserModule } from '@angular/platform-browser';
import { LoanModule } from '../loan/loan.module';
import { AdminPanelModule } from '../admin-panel/adminPanel.module';
import { SiteListModule } from '../sites-list/sitesList.module';
import { SinisterModule } from '../sinister/sinister-modal.module';

@NgModule({
  declarations: [
    LayoutComponent
  ],
  imports: [
    BrowserModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatMenuModule,
    MatSidenavModule,
    MatChipsModule,
    DashboardModule,
    HeaderModule,
    SidebarModule,
    UsersListModule,
    VehiclesListModule,
    LoanModule,
    AdminPanelModule,
    SiteListModule,
    SinisterModule
  ],
  exports: [
    LayoutComponent],
  providers: [],
  bootstrap: [LayoutComponent]
})
export class LayoutModule { }
