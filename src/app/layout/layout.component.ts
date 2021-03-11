import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.less']
})
export class LayoutComponent implements OnInit {

  /**
   * Composant à charger, nom récupéré à partir de la route
   */
  public componentToLoad: string = this.router.url.split('/')[1];

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

}
