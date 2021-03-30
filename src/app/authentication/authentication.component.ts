import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Common } from '../common/common';
import { AuthenticationDataModel } from './authentication.data.model';
import { AuthenticationService } from './authentication.service';

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
  get registerFormControls() {
    return this.registerForm.controls;
  }
  /**
   * Getter des contrôles du formulaire de connexion
   */
  get loginFormControls() {
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

  public constructor(private fb: FormBuilder, private authenticationService: AuthenticationService) {
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

  public ngOnInit() {
    this.authenticationService.getAuthStatusListener().subscribe(authStatus => {
      this.wrongId = !authStatus;
    });
  }

  public ngAfterViewInit() {
    Common.loadScript('../assets/js/login-background.js');
  }

  /**
   * Connexion utilisateur
   */
  public login() {
    const user: AuthenticationDataModel = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    }
    this.authenticationService.login(user);
  }

  /**
   * Inscription utlisateur
   */
  public register() {
    const user: AuthenticationDataModel = {
      name: this.registerForm.value.name,
      surname: this.registerForm.value.surname,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      phone: this.registerForm.value.phone
    }
    this.authenticationService.createUser(user);
  }

  /**
   * Inverse la valeur pour passer du formulaire d'inscription à celui de connexion
   * Et réinitialisation des formulaires
   */
  public toggleRegisterForm() {
    if (this.isRegisterForm) {
      this.registerForm.reset();
    } else if (!this.isRegisterForm) {
      this.loginForm.reset();
    }
    this.isRegisterForm = !this.isRegisterForm;
  }
}