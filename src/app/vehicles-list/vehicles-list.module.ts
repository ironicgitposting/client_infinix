import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogVehicle, VehiclesListComponent } from './vehicles-list.component';
import { HeaderModule } from '../header/header.module';
import { SidebarModule } from '../sidebar/sidebar.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  declarations: [
    VehiclesListComponent,
    DialogVehicle
  ],
  imports: [
    BrowserModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderModule,
    SidebarModule,
    MatSidenavModule,
    MatChipsModule,
    MatIconModule,
    MatSlideToggleModule,
    MatExpansionModule
  ],
  exports: [VehiclesListComponent],
  providers: [],
  bootstrap: [VehiclesListComponent]
})
export class VehiclesListModule { }