import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ParamsService} from './params.service';

@Injectable({
    providedIn: 'root'
})
export class CargoService {

    constructor(private http: HttpClient,
                private params: ParamsService) {
    }

    getCargos(): any {
        const environment = this.params.getParams();

        const apiPath = 'apps/cadastro-corretores/v1/cargos';

        const apiMethodUri = environment['apiBaseAddress'] + apiPath;

        const httpOptions = {
            headers: new HttpHeaders({
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            })
        };

        return this.http.get(apiMethodUri, httpOptions);
    }

}
