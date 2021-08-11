import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";

@Injectable({providedIn: 'root'})
export class MailService {


    constructor(private httpClient: HttpClient, private router: Router) {

    }

    /**
     * Méthode d'envoie de mail générique
     * @param mail mail du destinataire
     *
     */
    public sendMail(mail: string) {
        return this.httpClient.get('http://localhost:3000/api/v1/mails/mail/' + mail).subscribe();
    }

}
