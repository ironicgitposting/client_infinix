import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { UsersListComponent } from './usersList.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    UsersListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatButtonModule
  ],
  exports: [UsersListComponent],
  providers: [],
  bootstrap: [UsersListComponent]
})
export class UsersListModule { }
