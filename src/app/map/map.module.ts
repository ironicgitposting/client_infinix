import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MapComponent } from './map.component';

@NgModule({
  declarations: [
    MapComponent
  ],
  imports: [
    BrowserModule
  ],
  exports: [
    MapComponent
  ],
  providers: [],
  bootstrap: [MapComponent]
})
export class MapModule { }
