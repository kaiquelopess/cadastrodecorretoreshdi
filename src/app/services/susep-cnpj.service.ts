import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ParamsService} from './params.service';

@Injectable({
    providedIn: 'root'
})
export class SusepCnpjService {

    constructor(private http: HttpClient,
                private params: ParamsService) {
    }

    getSusep(origem, susep: string, cpfCnpj: string): any {
        const environment = this.params.getParams();

        const apiPath = 'apps/cadastro-corretores/v1/consultarsusep';

        const apiMethodUri = environment['apiBaseAddress'] + apiPath;

        const httpOptions = {
            headers: new HttpHeaders({
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }),
            params: new HttpParams()
                .set('susep', susep)
                .set('cpfCnpj', cpfCnpj)
                .set('origem', origem)
        };

        return this.http.get(apiMethodUri, httpOptions);
    }
}
