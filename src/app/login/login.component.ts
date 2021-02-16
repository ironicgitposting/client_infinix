import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit, AfterViewInit {

    /**
     * Conditionne l'affichage du formulaire d'inscription ou de connexion
     */
    public registerForm: boolean = false;

    public constructor() {
    }

    public ngOnInit() {
    }

    public ngAfterViewInit() {
        this.loadScript('../assets/js/login-background.js');
    }

    /**
     * Créer une balise script contenant l'url du fichier js
     * @param url chemin du fichier à charger
     */
    public loadScript(url: string) {
        const body = <HTMLDivElement> document.body;
        const script = document.createElement('script');
        script.innerHTML = '';
        script.src = url;
        script.async = false;
        script.defer = true;
        body.appendChild(script);
      }
}