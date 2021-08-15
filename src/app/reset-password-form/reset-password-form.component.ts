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
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'reset-password-form',
  templateUrl: './reset-password-form.component.html',
  styleUrls: ['./reset-password-form.component.less'],
})
export class ResetPasswordFormComponent implements OnInit, AfterViewInit {
  private userId: number;
  private token: string;

  public static readonly PASSWORD_REGEXP: string =
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&]).{8,}$';
  /**
   * formGroup de l'inscription
   */
  public resetPasswordForm: FormGroup;

  get registerFormControls(): { [p: string]: AbstractControl } {
    return this.resetPasswordForm.controls;
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
    private activatedRoute: ActivatedRoute,
  ) {
    this.resetPasswordForm = this.fb.group({
      password: new FormControl('', [
        Validators.minLength(8),
        Validators.required,
        Validators.pattern(ResetPasswordFormComponent.PASSWORD_REGEXP),
      ]),
      passwordConfirm: new FormControl('', [
        Validators.minLength(8),
        Validators.required,
        ResetPasswordFormComponent.confirmed('password', 'passwordConfirm'),
        Validators.pattern(ResetPasswordFormComponent.PASSWORD_REGEXP),
      ]),
    });
  }

  public ngOnInit(): void {
    this.activatedRoute.params.subscribe((param) => {
      this.userId = param['id'];
      this.token = param['token'];
    });
  }

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
      this.resetPasswordForm
    ) {
      this.sendPasswordReset();
    }
  }
  sendPasswordReset() {
    if (this.resetPasswordForm.valid) {
      const data = {
        token: this.token,
        userId: this.userId,
        clearPassword: this.resetPasswordForm.value.password,
      };
      this.authenticationService.changeUserPassword(data);
    }
  }

  IsMobile() {
    Device.definedUseDevice('auth-container');
    return Device.isMobileDevice();
  }
}
