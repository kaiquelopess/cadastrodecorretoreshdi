import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ParamsService} from './params.service';

@Injectable({
    providedIn: 'root'
})
export class EsquecisenhaService {

    constructor(private http: HttpClient,
                private params: ParamsService) {
    }


    EsqueciSenha(formSenha: any): any {

        const environment = this.params.getParams();

        const apiPath = 'apps/cadastro-corretores/v1/esquecisenha';

        const apiMethodUri = environment['apiBaseAddress'] + apiPath;

        const httpOptions = {
            headers: new HttpHeaders({

                'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json', 'Accept': 'application/json'
            })
        };

        const data = {
            'dsEntradaEsqueciSenha': {

                'ttEntradaEsqueciSenha': [

                    {

                        'p_tipprodutor': 'C', //C

                        'p_codprodutor': formSenha.codProdutor, //CPF/CNPJ

                        'p_origem': 'CAD_CORRETOR', //CAD.CORRETOR

                        'p_ipusuario': formSenha.ipUsuario

                    }

                ]

            }
        };

        return this.http.post(apiMethodUri, data, httpOptions);
    }
}
