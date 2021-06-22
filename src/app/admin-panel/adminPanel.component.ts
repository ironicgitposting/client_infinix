import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ApplicationSettingsService } from './application-settings.service';
import { Setting } from './setting.model';

export interface MailingOptionsElements {
  name: string;
  description: string;
  active: boolean;
}

@Component({
  selector: 'admin-panel',
  templateUrl: './adminPanel.component.html',
  styleUrls: ['./adminPanel.component.less'],
})
export class AdminPanelComponent implements OnInit, AfterViewInit {
  settings: Setting[] = [];
  constructor(private adminService: ApplicationSettingsService) { }

  ngAfterViewInit(): void { }
  ngOnInit(): void {
    this.adminService.getSettings().subscribe(settings => {
      this.settings = settings;
    })
  }
}
