import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    MatCardModule
  ],
  exports: [DashboardComponent],
  providers: [],
  bootstrap: [DashboardComponent]
})
export class DashboardModule { }
