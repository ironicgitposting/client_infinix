import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Common } from '../common/common';
import { AuthenticationDataModel } from './authentication.data.model';
import { AuthenticationService } from './authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageService } from '../common/services/message.service';

@Component({
  selector: 'authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.less']
})
export class AuthenticationComponent implements OnInit, AfterViewInit {

  public static readonly PASSWORD_REGEXP: string = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&]).{8,}$';

  /**
   * Conditionne l'affichage du formulaire d'inscription ou de connexion
   */
  public isRegisterForm: boolean = false;
  /**
   * formGroup du login
   */
  public loginForm: FormGroup;
  /**
   * formGroup de l'inscription
   */
  public registerForm: FormGroup;

  /**
   * Détermine l'affichage de l'erreur des identifiants incorrects
   */
  public wrongId: boolean = false;

  /**
   * Getter des contrôles du formulaire d'inscription
   */
  get registerFormControls(): {[p: string]: AbstractControl} {
    return this.registerForm.controls;
  }
  /**
   * Getter des contrôles du formulaire de connexion
   */
  get loginFormControls(): {[p: string]: AbstractControl} {
    return this.loginForm.controls;
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
            return ({ confirmedValidator: true });
        } else {
            matchingInput.setErrors(null);
            return null;
        }
      } else {
        return null;
      }
    };
}

  public constructor(private fb: FormBuilder,
                     private authenticationService: AuthenticationService,
                     private _snackBar: MatSnackBar,
                     private msgService: MessageService) {
    this.registerForm = this.fb.group({
      name: new FormControl('', Validators.required),
      surname: new FormControl('', Validators.required),
      password: new FormControl('', [
        Validators.minLength(8),
        Validators.required,
        Validators.pattern(AuthenticationComponent.PASSWORD_REGEXP),
      ]),
      passwordConfirm: new FormControl('', [
        Validators.minLength(8),
        Validators.required,
        AuthenticationComponent.confirmed('password', 'passwordConfirm'),
        Validators.pattern(AuthenticationComponent.PASSWORD_REGEXP),
      ]),
      email: new FormControl('', [
        Validators.email,
        Validators.required
      ]),
      emailConfirm: new FormControl('', [
        Validators.email,
        Validators.required,
        AuthenticationComponent.confirmed('email', 'emailConfirm')
      ]),
      phone: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10)
      ])
    });
    this.loginForm = this.fb.group({
      email: new FormControl('', [
        Validators.email,
        Validators.required
      ]),
      password: new FormControl('', [
        Validators.minLength(8),
        Validators.required,
        Validators.pattern(AuthenticationComponent.PASSWORD_REGEXP),
      ])
    });
  }

  public ngOnInit(): void {
    this.authenticationService.getAuthStatusListener().subscribe(authStatus => {
      this.wrongId = !authStatus;
    });
  }

  public ngAfterViewInit(): void {
    Common.loadScript('../assets/js/login-background.js');
  }

  /**
   * Connexion utilisateur
   */
  public login(): void {
    const user: AuthenticationDataModel = new AuthenticationDataModel();
    user.email = this.loginForm.value.email;
    user.password = this.loginForm.value.password;
    this.authenticationService.login(user);
  }

  /**
   * Inscription utlisateur
   */
  public register(): void {
    const user: AuthenticationDataModel = new AuthenticationDataModel();
    user.name = this.registerForm.value.name;
    user.surname = this.registerForm.value.surname;
    user.email = this.registerForm.value.email;
    user.password = this.registerForm.value.password;
    user.phone = this.registerForm.value.phone;
    this.authenticationService.createUser(user);
    this.openSnackBar('success', 'Demande de création de compte enregistrée');
    this.toggleRegisterForm();
  }

  /**
   * Inverse la valeur pour passer du formulaire d'inscription à celui de connexion
   * Et réinitialisation des formulaires
   */
  public toggleRegisterForm(): void {
    if (this.isRegisterForm) {
      this.registerForm.reset();
    } else if (!this.isRegisterForm) {
      this.loginForm.reset();
      this.wrongId = false;
    }
    this.isRegisterForm = !this.isRegisterForm;
  }

  public openSnackBar(type: string, message: string): void {
    this.msgService.snackbar(message, type);
  }

  public sendForm(event: KeyboardEvent): void {
    if (event.code && (event.code.toLowerCase() === 'enter' || event.code.toLowerCase() === 'numpadenter') && !this.isRegisterForm) {
      this.login();
    } else if (event.code && (event.code.toLowerCase() === 'enter' || event.code.toLowerCase() === 'numpadenter') && this.isRegisterForm) {
      this.register();
    }
  }
}
