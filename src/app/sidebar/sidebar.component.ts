import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication/authentication.service';
import { MessageService } from '../common/services/message.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.less'],
})
export class SidebarComponent implements OnInit {
  public adminMenu = false;

  constructor(
    private router: Router,
    private msgService: MessageService,
    private authService: AuthenticationService,
  ) {
    this.adminMenu = this.authService.getIsAdmin();
  }

  ngOnInit(): void {}

  /**
   * Redirige vers la route passée en paramètre
   * @param target Nom de la route
   */
  public redirectTo(target: string) {
    this.router.navigate(['/' + target]);
  }

  public workInProgress(page: string) {
    this.msgService.snackbar(
      'La page ' + page + " n'est pas encore disponible",
      'warning',
    );
  }
}
