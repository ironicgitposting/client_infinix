import { AfterViewInit, Component, OnInit } from '@angular/core';

export interface MailingOptionsElements {
  id: number;
  name: string;
  description?: string;
  active: boolean;
}

const ELEMENT_DATA: MailingOptionsElements[] = [
  {
    id: 1,
    name: 'Confirmation Admin',
    description: "Envoie du mail à l'admin après inscription utilisateur",
    active: true,
  },
  {
    id: 2,
    name: 'Confirmation Utilisateur',
    description: "Envoie du mail à l'utilisateur après inscription utilisateur",
    active: false,
  },
];

@Component({
  selector: 'mailing-panel',
  templateUrl: './mailingPanel.html',
  styleUrls: ['./mailingPanel.component.less'],
})
export class MailingPanelComponent implements OnInit, AfterViewInit {
  constructor() {}
  displayedColumns: string[] = ['name', 'description', 'active'];
  dataSource = ELEMENT_DATA;

  toggleMailingOption(element: any, event: any) {
    console.log(element, event);
    // Update Service
  }

  ngAfterViewInit(): void {}
  ngOnInit(): void {}
}
