import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { UsersListComponent, DialogUser } from './usersList.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select'


@NgModule({
  declarations: [
    UsersListComponent,
    DialogUser
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
    MatSelectModule
  ],
  exports: [UsersListComponent],
  providers: [],
  bootstrap: [UsersListComponent]
})
export class UsersListModule { }
