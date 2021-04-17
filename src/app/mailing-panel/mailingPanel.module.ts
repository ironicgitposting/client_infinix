import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MailingPanelComponent } from './mailingPanel.component';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  declarations: [MailingPanelComponent],
  imports: [BrowserModule, MatTableModule, MatSlideToggleModule],
  exports: [MailingPanelComponent],
  providers: [],
  bootstrap: [MailingPanelComponent],
})
export class MailingPanelModule {}
