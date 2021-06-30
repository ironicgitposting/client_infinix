import { AfterViewInit, Component, OnInit } from '@angular/core';
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
  constructor() { }


  ngAfterViewInit(): void { }

  ngOnInit(): void {

  }
}
