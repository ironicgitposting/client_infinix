import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AlertComponent } from './alert.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    AlertComponent
  ],
  imports: [
    BrowserModule,
    MatIconModule,
    MatButtonModule
  ],
  exports: [AlertComponent],
  providers: [],
  bootstrap: [AlertComponent]
})
export class AlertModule { }
