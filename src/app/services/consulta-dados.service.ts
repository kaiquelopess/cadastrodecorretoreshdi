import { Injectable, Input } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import {ParamsService} from './params.service';

@Injectable({
    providedIn: 'root'
})

export class ConsultaDadosService {

    constructor(private http: HttpClient,
                private params: ParamsService) { }

    consultaDados(): any {
        const apiPath = 'apps/cadastro-corretores/v1/novoscorretores';

        const environment = this.params.getParams();

        const apiMethodUri = environment['apiBaseAddress'] + apiPath;

        const httpOptions = {
            headers: new HttpHeaders({
                'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
            }), params: new HttpParams()
                .set('pSusep', sessionStorage.getItem('codigoSusep'))
                .set('pCpfCnpj', sessionStorage.getItem('cnpjCpf'))
        };

        return this.http.get(apiMethodUri, httpOptions);

    }
}
