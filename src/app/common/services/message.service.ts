import { SnackbarComponent } from '../../snackbar/snackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../../confirm/confirm.component';
import { Observable } from 'rxjs';
import { AlertComponent } from '../../alert/alert.component';

@Injectable()
export class MessageService {

  constructor(private snackBar: MatSnackBar,
              public dialog: MatDialog) {
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

  public confirm(message: string = ''): Observable<any> {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: { message },
      maxWidth: '500px'
    });

    return dialogRef.afterClosed();
  }

  public alert(message: string = ''): void {
    this.dialog.open(AlertComponent, {
      data: { message },
      maxWidth: '500px'
    });
  }
}
