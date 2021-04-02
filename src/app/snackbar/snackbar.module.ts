import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { SnackbarComponent } from './snackbar.component';

@NgModule({
  declarations: [
    SnackbarComponent
  ],
  imports: [
    BrowserModule,
    MatIconModule
  ],
  exports: [
    SnackbarComponent],
  providers: [],
  bootstrap: [SnackbarComponent]
})
export class SnackBarModule { }
