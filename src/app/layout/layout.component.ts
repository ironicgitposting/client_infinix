import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.less'],
})
export class LayoutComponent implements OnInit {
  private static USERS_COMPONENT = 'users';
  private static PARC_COMPONENT = 'parc';
  private static LOAN_COMPONENT = 'loan';

  /**
   * Composant à charger, nom récupéré à partir de la route
   */
  public componentToLoad: string = this.router.url.split('/')[1];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  /**
   * Retourne le nom de la page en fonction de l'url
   */
  public getPageName(): string {
    let pageName = 'Tableau de bord';
    switch (this.componentToLoad) {
      case LayoutComponent.USERS_COMPONENT:
        pageName = 'Utilisateurs';
        break;
      case LayoutComponent.PARC_COMPONENT:
        pageName = 'Parc';
        break;
      case LayoutComponent.LOAN_COMPONENT:
        pageName = 'Prêts';
        break;
    }
    return pageName;
  }
}
