import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogVehicle, VehiclesListComponent, HistoricalVehicle } from './vehicles-list.component';
import { HeaderModule } from '../header/header.module';
import { SidebarModule } from '../sidebar/sidebar.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [
    VehiclesListComponent,
    DialogVehicle,
    HistoricalVehicle
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
    MatExpansionModule,
    MatSelectModule,
    MatTableModule
  ],
  exports: [VehiclesListComponent],
  providers: [],
  bootstrap: [VehiclesListComponent]
})
export class VehiclesListModule { }