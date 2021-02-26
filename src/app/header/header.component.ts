import { Component, Input, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { User } from '../users-list/user.model';
import * as moment from 'moment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {

  /**
   * Nom de la page affichée, par défaut = Tableau de bord
   */
  @Input() pageName: string = 'Tableau de bord';
  /**
   * Utilisateur connecté
   */
  @Input() connectedUser: User;

  /**
   * Date du jour au format string
   */
  public today: string = moment().locale('fr').format("dddd Do MMMM YYYY");;

  constructor(
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    // TODO: Supprimer et récupérer l'utilisateur connecté
    this.connectedUser = {
      surname: 'Corentin',
      name: 'Jules',
      profession: 1,
      email: 'test@test.com',
      telephone: '0101010101',
      authorizationAccess: '',
      dateLastSeen: moment(),
      site: 1,
      language: 1,
      archived: false
    };
  }

  /**
   * Déconnexion
   */
  public logout() {
    this.authenticationService.logout();
  }

}
