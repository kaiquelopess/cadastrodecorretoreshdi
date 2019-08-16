import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ParamsService} from './params.service';

@Injectable({
    providedIn: 'root'
})
export class ListaBancosService {

    constructor(private http: HttpClient,
                private params: ParamsService) {
    }

    getBancos(): any {
        const environment = this.params.getParams();

        const apiPath = 'apps/cadastro-corretores/v1/buscarBanco';

        const apiMethodUri = environment['apiBaseAddress'] + apiPath;
        const httpOptions = {
            headers: new HttpHeaders({
                'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json', 'Accept': 'application/json'
            })
        };

        const data = {
            'request': {
                'dsEntrada': {
                    'dsEntrada':

                        {
                            'prods:hasChanges': false,

                            'ttEntradaDados': [{'codBanco': '', 'flgCompensacao': '', 'flgPoupanca': ''}]

                        }

                }
            }
        };
        return this.http.post(apiMethodUri, data, httpOptions);

    }
}
