import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AuthenticationComponent } from './authentication.component';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from '../common/services/message.service';

@NgModule({
  declarations: [
    AuthenticationComponent
  ],
  imports: [
    BrowserModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [AuthenticationComponent],
  providers: [MessageService],
  bootstrap: [AuthenticationComponent]
})
export class AuthenticationModule { }
