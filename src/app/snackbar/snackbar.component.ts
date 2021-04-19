import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.less']
})
export class SnackbarComponent implements OnInit {

  /**
   * Différents types d'alerte
   */
  private static readonly WARNING_TYPE = 'warning';
  private static readonly INFO_TYPE = 'info';
  private static readonly SUCCESS_TYPE = 'success';
  private static readonly ERROR_TYPE = 'error';

  constructor(private _snackRef: MatSnackBarRef<SnackbarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: {
    message: string,
    type: string
  }) { }

  ngOnInit(): void {
    if (!this.data.message) {
      this.data.message = 'Succès';
    }
    if (!this.data.type) {
      this.data.type = 'success';
    }
  }

  /**
   * Est de type warning
   */
  public isTypeWarning(): boolean {
    return this.data.type === SnackbarComponent.WARNING_TYPE;
  }

  /**
   * Est de type info
   */
  public isTypeInfo(): boolean {
    return this.data.type === SnackbarComponent.INFO_TYPE;
  }

  /**
   * Est de type success
   */
  public isTypeSuccess(): boolean {
    return this.data.type === SnackbarComponent.SUCCESS_TYPE;
  }

  /**
   * Est de type error
   */
  public isTypeError(): boolean {
    return this.data.type === SnackbarComponent.ERROR_TYPE;
  }

  /**
   * Fermeture de la snackbar
   */
  public close(): void {
    this._snackRef.dismiss();
  }

}
