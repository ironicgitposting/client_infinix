import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ArchivedSinistersComponent } from './archived-sinisters.component';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [
    ArchivedSinistersComponent,
  ],
  imports: [
    BrowserModule,
    MatCardModule
  ],
  exports: [ArchivedSinistersComponent],
  providers: [],
  bootstrap: [ArchivedSinistersComponent],
})
export class ArchivedSinistersModule {
}
