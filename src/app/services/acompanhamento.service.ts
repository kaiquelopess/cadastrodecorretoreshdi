import {Injectable, Input} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {ParamsService} from './params.service';

// import {environment} from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AcompanhamentoService {

    constructor(private http: HttpClient,
                private params: ParamsService) {
    }


    historicoAcompanhamento(salvar: any): any {

        const environment = this.params.getParams();

        const apiPath = 'apps/cadastro-corretores/v1/aprovacaocorretor';

        const apiMethodUri = environment['apiBaseAddress'] + apiPath;

        const httpOptions = {

            headers: new HttpHeaders({
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            })

            , params: new HttpParams()
                .set('pSusep', salvar.susep)
                .set('pCPFCNPJ', salvar.cnpjCpf)
        };

        return this.http.get(apiMethodUri, httpOptions);
    }

}
