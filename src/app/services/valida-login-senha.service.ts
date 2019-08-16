import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ParamsService} from './params.service';

@Injectable({
    providedIn: 'root'
})
export class ValidaLoginSenhaService {


    constructor(private http: HttpClient,
                private params: ParamsService) {
    }

    validaLoginSenha(formulario: any): any {
        const environment = this.params.getParams();

        const apiPath = 'apps/cadastro-corretores/v1/login';

        const apiMethodUri = environment['apiBaseAddress'] + apiPath;
        const httpOptions = {
            headers: new HttpHeaders({
                'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json', 'Accept': 'application/json'
            })
        };

        const data = {

            'login': formulario.login,
            'senha': formulario.senha

        };
        return this.http.post(apiMethodUri, data, httpOptions);
    }
}
