import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Setting } from '../admin-panel/setting.model';
import { ApplicationSettingsService } from '../admin-panel/application-settings.service'


@Component({
  selector: 'mailing-panel',
  templateUrl: './mailingPanel.html',
  styleUrls: ['./mailingPanel.component.less'],
})
export class MailingPanelComponent implements OnInit, AfterViewInit {
  settings: Setting[] = [];
  // Add adminService to constructor
  constructor(private adminService: ApplicationSettingsService) { }

  displayedColumns: string[] = ['name', 'description', 'active'];


  toggleMailingOption(element: any, event: any) {
    if (event.checked) {
      element.flag = 1;
    } else {
      element.flag = 0;
    }
    // Update Service
    this.adminService.updateSetting(element)
  }

  ngAfterViewInit(): void { }

  ngOnInit(): void {
    this.adminService.getSettings().subscribe(settings => {
      this.settings = settings;
    })
  }
}
