import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard.component';
import { HeaderModule } from '../header/header.module';
import { SidebarModule } from '../sidebar/sidebar.module';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderModule,
    SidebarModule
  ],
  exports: [DashboardComponent],
  providers: [],
  bootstrap: [DashboardComponent]
})
export class DashboardModule { }
