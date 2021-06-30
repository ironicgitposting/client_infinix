import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ResetPasswordFormComponent } from './reset-password-form.component';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from '../common/services/message.service';

@NgModule({
  declarations: [ResetPasswordFormComponent],
  imports: [
    BrowserModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [ResetPasswordFormComponent],
  providers: [MessageService],
  bootstrap: [ResetPasswordFormComponent],
})
export class ResetPasswordFormModule {}
