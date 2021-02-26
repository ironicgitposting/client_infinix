import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { SidebarComponent } from './sidebar.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    SidebarComponent
  ],
  imports: [
    BrowserModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule
  ],
  exports: [SidebarComponent],
  providers: [],
  bootstrap: [SidebarComponent]
})
export class SidebarModule { }
