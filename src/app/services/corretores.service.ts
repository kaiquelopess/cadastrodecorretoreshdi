import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ParamsService} from './params.service';

@Injectable({
    providedIn: 'root'
})
export class CorretoresService {

    constructor(private http: HttpClient,
                private params: ParamsService) {
    }

    corretores(filtro: any) {
        const environment = this.params.getParams();

        const apiPath = 'usuario/pessoa/v1/corretores';

        const apiMethodUri = environment['apiBaseAddress'] + apiPath;

        const httpOptions = {
            headers: new HttpHeaders({
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            })

            , params: new HttpParams()
                .set('tpProdutor', 'G,T')
                .set('nomProdutor', filtro)
        };

        return this.http.get(apiMethodUri, httpOptions);
    }

}
