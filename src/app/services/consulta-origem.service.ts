import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ParamsService} from './params.service';

@Injectable({
    providedIn: 'root'
})
export class ConsultaOrigemService {

    static consultaOrigem(origem) {
        throw new Error('Method not implemented.');
    }

    constructor( private http: HttpClient,
                 private params: ParamsService) {
    }

    consultaOrigem(origem): any {
        const apiPath = 'corporativo/empresa/v1/origens';

        const environment = this.params.getParams();

        const apiMethodUri = environment['apiBaseAddress'] + apiPath;

        const httpOptions = {
            headers: new HttpHeaders({
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            })

            , params: new HttpParams()
                .set('nomEmpresa', origem)
                .set('codEmpresa', '')
                .set('codOrigem', '')
        };

        return this.http.get(apiMethodUri, httpOptions);
    }

}
