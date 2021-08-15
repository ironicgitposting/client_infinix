import { Component, ViewChild } from '@angular/core';
import { OnInit } from '@angular/core';
import { User } from './user.model';
import { UserService } from './usersList.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { AuthenticationService } from '../authentication/authentication.service';
import { MessageService } from '../common/services/message.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { AuthenticationDataModel } from '../authentication/authentication.data.model';

@Component({
  selector: 'usersList',
  templateUrl: './usersList.component.html',
  styleUrls: ['./usersList.component.less']
})
export class UsersListComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;

  users: User[] = [];

  public columnsToDisplay: string[] = ['email', 'surname', 'name', 'telephone', 'authorizationAccess', 'enabled', 'action'];

  public columnsName: {
    [email: string]: string;
    name: string;
    surname: string;
    telephone: string;
    authorizationAccess: string;
    enabled: string;
    action: string;
  } = {
    email: 'Email',
    name: 'Prénom',
    surname: 'Nom',
    telephone: 'Téléphone',
    authorizationAccess: 'Profil',
    enabled: 'Activé',
    action: 'action'
  };

  dataSource: MatTableDataSource<User>;

  constructor(
    private userService: UserService,
    public dialog: MatDialog,
    private authService: AuthenticationService,
    private msgService: MessageService) {

  }

  public ngOnInit(): void {
    this.fetchUsers();
  }

  public fetchUsers(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.sort = this.sort;
    });
  }

  public updateUserDialog(mode: string, user: User): void {
    const dialogRef = this.dialog.open(DialogUser, {
      data: { mode: mode, user: user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.saved) {
        this.userService.updateUser(result.user).subscribe(response => {
          this.msgService.snackbar('Modifications enregistrées', 'success');
          this.fetchUsers();
        });
      }
    });
  }

  public deleteUser(user: User): void {
    this.msgService.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?').subscribe(response => {
      if (user.email && response) {
        this.userService.deleteUser(user);
        this.msgService.snackbar('Utilisateur supprimé', 'success');
      }
    });
  }

  public onUserSwitchToggle($event: MatSlideToggleChange, user: User): void {
    user.enabled = $event.checked;
    this.userService.updateUser(user).subscribe();
    let snackbarMessage: string = '';
    if (user.enabled) {
      snackbarMessage = 'Utilisateur activé';
    } else {
      snackbarMessage = 'Utilisateur désactivé';
    }
    this.msgService.snackbar(snackbarMessage);
  }

  /**
   * Ouverture de la modale de création d'un utilisateur
   * @param mode Mode d'ouverture
   * @param user
   */
  public openUserModal(mode: string, user: User | null): void {
    const dialogRef = this.dialog.open(DialogUser, {
      data: { mode: mode, user: user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.saved) {
        this.authService.createUser(result.user).subscribe(response => {
          this.msgService.snackbar('Utilisateur enregistré', 'success');
          this.fetchUsers();
        });
      }
    });
  }

  public displayProfile(authorizationAccess: number): string {
    let ret: string = 'Administrateur';
    if (authorizationAccess === 0) {
      ret = 'Utilisateur';
    }
    return ret;
  }

  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

@Component({
  selector: 'dialog-modal',
  templateUrl: './userModal.html',
  styleUrls: ['./usersList.component.less'],
})
export class DialogUser implements OnInit {

  public userForm: FormGroup;

  public modalUser: User;

  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<DialogUser>,
    private router: Router,
    public dialog: MatDialog,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.userForm = this.fb.group({
      email: new FormControl({value: '', disabled: !this.isNewMode()}, [Validators.required, Validators.email]),
      name: new FormControl('', Validators.required),
      surname: new FormControl('', Validators.required),
      phone: new FormControl('', [Validators.required]),
      profile: new FormControl('', []),
    });
  }

  public ngOnInit(): void {
    if (this.data.user) {
      // On alimente le formgroup avec les valeurs de l'utilisateur
      this.userForm.controls['email'].setValue(this.data.user.email);
      this.userForm.controls['name'].setValue(this.data.user.name);
      this.userForm.controls['surname'].setValue(this.data.user.surname);
      this.userForm.controls['phone'].setValue(this.data.user.telephone);
      this.userForm.controls['profile'].setValue(this.data.user.authorizationAccess);
    }
  }

  public save(saved: boolean = false): void {
    const user: User = new User();
    if (saved) {
      if (this.data && this.data.user) {
        user.id = this.data.user.id;
      }
      user.email = this.userForm.controls['email'].value;
      user.name = this.userForm.controls['name'].value;
      user.surname = this.userForm.controls['surname'].value;
      user.telephone = this.userForm.controls['phone'].value;
      if (this.userForm.controls['profile'].value) {
        user.authorizationAccess = 1;
      } else {
        user.authorizationAccess = 0;
      }
    }
    this.close(saved, user);
  }

  public close(saved: boolean = false, user?: AuthenticationDataModel | User): void {
    this.dialogRef.close({ saved: saved, user: user });
  }

  /**
   * Détermine l'état du bouton de sauvegarde
   */
  public isSaveDisabled(): boolean {
    return this.userForm.touched && this.userForm.valid;
  }

  /**
   * Est-on en mode création
   */
  public isNewMode(): boolean {
    return this.data.mode === 'new';
  }

  /**
   * Est-on en mode modification
   */
  public isUpdateMode(): boolean {
    return this.data.mode === 'update';
  }
}
