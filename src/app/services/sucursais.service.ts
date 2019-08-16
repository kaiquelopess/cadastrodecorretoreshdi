import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ParamsService} from './params.service';

@Injectable({
    providedIn: 'root'
})
export class SucursaisService {

    constructor(private http: HttpClient,
                private params: ParamsService) {
    }

    getSucursais(origem, susep: string, cpfCnpj: string): any {
        const environment = this.params.getParams();

        const apiPath = 'apps/cadastro-corretores/v1/obterlistasucativanome';

        const apiMethodUri = environment['apiBaseAddress'] + apiPath;

        const httpOptions = {
            headers: new HttpHeaders({
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            })
            , params: new HttpParams()
                .set('origem', origem.toString())
                .set('susep', susep)
                .set('cpfCnpj', cpfCnpj)
        };
        return this.http.get(apiMethodUri, httpOptions);
    }
}
