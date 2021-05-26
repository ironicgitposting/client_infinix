import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { SitesListComponent, DialogSite } from './sitesList.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select'
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    SitesListComponent,
    DialogSite
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatCardModule,
    MatIconModule
  ],
  exports: [SitesListComponent],
  providers: [],
  bootstrap: [SitesListComponent]
})
export class SiteListModule { }
