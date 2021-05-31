import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ConfirmComponent } from '../confirm/confirm.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    ConfirmComponent
  ],
  imports: [
    BrowserModule,
    MatIconModule,
    MatButtonModule
  ],
  exports: [ConfirmComponent],
  providers: [],
  bootstrap: [ConfirmComponent]
})
export class ConfirmModule { }
