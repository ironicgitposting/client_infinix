import { Component, Inject, Input, LOCALE_ID, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { User } from '../users-list/user.model';
import * as moment from 'moment';
import { Device } from '../common/device'

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

  public userProfile: string;

  /**
   * Date du jour au format string
   */
  public today: string = moment().locale('fr').format('dddd Do MMMM YYYY');

  constructor(
    private authenticationService: AuthenticationService,
    @Inject(LOCALE_ID) public locale: string
  ) { }

  ngOnInit(): void {
    const localStorageUser: string = localStorage.getItem('connectedUser') || '';
    this.connectedUser = JSON.parse(localStorageUser);
    if (!this.connectedUser.profile) {
      this.userProfile = 'Administrateur';
    }
    
  }
  IsMobile(){
    Device.definedUseDevice('header-container');
    return Device.isMobileDevice();
  }

  /**
   * Déconnexion
   */
  public logout(): void {
    this.authenticationService.logout();
  }

}
