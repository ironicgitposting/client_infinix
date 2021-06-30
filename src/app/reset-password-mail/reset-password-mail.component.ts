import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Common } from '../common/common';
import { AuthenticationService } from '../authentication/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageService } from '../common/services/message.service';
import { Device } from '../common/device';

@Component({
  selector: 'reset-password-mail',
  templateUrl: './reset-password-mail.component.html',
  styleUrls: ['./reset-password-mail.component.less'],
})
export class ResetPasswordMailComponent implements OnInit, AfterViewInit {
  /**
   * formGroup de l'inscription
   */
  public resetPasswordMailForm: FormGroup;

  get registerFormControls(): { [p: string]: AbstractControl } {
    return this.resetPasswordMailForm.controls;
  }

  static confirmed = (controlName: string, matchingControlName: string) => {
    return (control: AbstractControl) => {
      if (control && control.parent) {
        const input = control.parent.get(controlName);
        const matchingInput = control.parent.get(matchingControlName);

        if (input === null || matchingInput === null) {
          return null;
        }

        if (matchingInput?.errors && !matchingInput.errors.confirmedValidator) {
          return null;
        }

        if (input.value !== matchingInput.value) {
          matchingInput.setErrors({ confirmedValidator: true });
          return { confirmedValidator: true };
        } else {
          matchingInput.setErrors(null);
          return null;
        }
      } else {
        return null;
      }
    };
  };

  public constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private _snackBar: MatSnackBar,
    private msgService: MessageService,
  ) {
    this.resetPasswordMailForm = this.fb.group({
      email: new FormControl('', [Validators.email, Validators.required]),
    });
  }

  public ngOnInit(): void {}

  public ngAfterViewInit(): void {
    Common.loadScript('../assets/js/login-background.js');
  }

  /**
   * Inverse la valeur pour passer du formulaire d'inscription à celui de connexion
   * Et réinitialisation des formulaires
   */

  public openSnackBar(type: string, message: string): void {
    this.msgService.snackbar(message, type);
  }

  public sendForm(event: KeyboardEvent): void {
    if (
      event.code &&
      (event.code.toLowerCase() === 'enter' ||
        event.code.toLowerCase() === 'numpadenter') &&
      this.resetPasswordMailForm
    ) {
      this.sendResetMail();
    }
  }
  sendResetMail() {
    if (this.resetPasswordMailForm.valid) {
      const email = this.resetPasswordMailForm.value.email;
      this.authenticationService.sendPasswordResetMail(email);
    }
  }

  IsMobile() {
    Device.definedUseDevice('auth-container');
    return Device.isMobileDevice();
  }
}
