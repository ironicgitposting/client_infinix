import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MatCardModule } from '@angular/material/card';
import { AdminPanelComponent } from './adminPanel.component';
import { MailingPanelModule } from '../mailing-panel/mailingPanel.module';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [AdminPanelComponent],
  imports: [
    BrowserModule,
    MatTabsModule,
    MailingPanelModule,
    MatCardModule
  ],
  exports: [AdminPanelComponent],
  providers: [],
  bootstrap: [AdminPanelComponent],
})
export class AdminPanelModule { }
