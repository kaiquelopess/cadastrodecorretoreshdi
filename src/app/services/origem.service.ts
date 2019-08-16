import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ParamsService} from './params.service';

@Injectable({
    providedIn: 'root'
})
export class ConsultaOrigemService {

    constructor(private http: HttpClient,
                private params: ParamsService) {
    }

    static consultaOrigem(origem) {
        throw new Error('Method not implemented.');
    }

    consultaOrigem(origem: number): any {
        const environment = this.params.getParams();

        const apiPath = 'corporativo/empresa/v1/origens';

        const apiMethodUri = environment['apiBaseAddress'] + apiPath;

        const httpOptions = {
            headers: new HttpHeaders({
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            })

            , params: new HttpParams()
                .set('nomEmpresa', '')
                .set('codEmpresa', '')
                .set('codOrigem', origem.toString())
        };

        return this.http.get(apiMethodUri, httpOptions);
    }

}
