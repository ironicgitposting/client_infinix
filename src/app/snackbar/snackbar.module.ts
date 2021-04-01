import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SnackbarComponent } from './snackbar.component';

@NgModule({
  declarations: [
    SnackbarComponent
  ],
  imports: [
    BrowserModule
  ],
  exports: [
    SnackbarComponent],
  providers: [],
  bootstrap: [SnackbarComponent]
})
export class SnackBarModule { }
