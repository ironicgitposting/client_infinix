import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ResetPasswordMailComponent } from './reset-password-mail.component';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from '../common/services/message.service';

@NgModule({
  declarations: [ResetPasswordMailComponent],
  imports: [
    BrowserModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [ResetPasswordMailComponent],
  providers: [MessageService],
  bootstrap: [ResetPasswordMailComponent],
})
export class ResetPasswordMailModule {}
