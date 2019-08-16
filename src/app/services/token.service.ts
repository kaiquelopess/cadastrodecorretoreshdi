import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ParamsService} from './params.service';

@Injectable({
    providedIn: 'root'
})
export class TokenService {

    apiPath = 'corporativo/autenticacao/oauth/token';

    constructor(private http: HttpClient,
                private params: ParamsService) {
    }

    getToken() {

        const environment = this.params.getParams();

        const apiMethodUri = environment['apiTokenBaseAddress'] + this.apiPath;

        const username: string = environment['tokenUsername'];
        const password: string = environment['tokenPassword'];

        const httpOptions = {
            headers: new HttpHeaders({
                'Authorization': 'Basic ' + btoa(username + ':' + password),
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        };

        const body = 'grant_type=client_credentials';

        return this.http.post(apiMethodUri, body, httpOptions);
    }

}
