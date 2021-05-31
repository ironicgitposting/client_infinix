import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication/authentication.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.less'],
})
export class LayoutComponent implements OnInit {
  private static USERS_COMPONENT = 'users';
  private static PARC_COMPONENT = 'parc';
  private static LOAN_COMPONENT = 'loan';
  private static SITE_COMPONENT = 'site';
  private static ADMIN_COMPONENT = 'admin';

  public adminMenu = false;
  /**
   * Composant à charger, nom récupéré à partir de la route
   */
  public componentToLoad: string = this.router.url.split('/')[1];

  constructor(
    private router: Router,
    private authService: AuthenticationService,
  ) {
    this.adminMenu = this.authService.getIsAdmin();
    debugger;
  }

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
      case LayoutComponent.SITE_COMPONENT:
        pageName = 'Sites';
        break;
      case LayoutComponent.ADMIN_COMPONENT:
        pageName = "Panneau d'administration";
        break;
    }
    return pageName;
  }
}
