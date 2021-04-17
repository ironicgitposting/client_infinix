import { SnackbarComponent } from '../../snackbar/snackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';

@Injectable()
export class MessageService {

  constructor(private snackBar: MatSnackBar) {
  }

  public snackbar(message: string = 'Succès', type: string = 'success', duration: number = 5000): void {
    this.snackBar.openFromComponent(SnackbarComponent, {
      duration: duration,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      data: {
        message: message,
        type: type
      },
      panelClass: [type]
    });
  }

  // TODO: Créer ici une méthode pour afficher une modale de confirmation
}
