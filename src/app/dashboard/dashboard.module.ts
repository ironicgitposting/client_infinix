import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { DashboardComponent } from './dashboard.component';
import { HeaderModule } from '../header/header.module';
import { SidebarModule } from '../sidebar/sidebar.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    MatCardModule,
    HeaderModule,
    SidebarModule,
    MatSidenavModule,
    MatChipsModule,
    MatIconModule
  ],
  exports: [DashboardComponent],
  providers: [],
  bootstrap: [DashboardComponent]
})
export class DashboardModule { }
