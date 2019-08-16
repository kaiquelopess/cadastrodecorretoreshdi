import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ParamsService} from './params.service';

@Injectable({
    providedIn: 'root'
})
export class AprovacaoService {

    constructor(private http: HttpClient,
                private params: ParamsService) {
    }

    aprovacaoCorretor(acao: any) {

        const environment = this.params.getParams();

        const apiPath = 'apps/cadastro-corretores/v1/aprovacaocorretor';

        const apiMethodUri = environment['apiBaseAddress'] + apiPath;

        const httpOptions = {
            headers: new HttpHeaders({
                'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json'
            })
        };

        const data = {
            'request': {
                'dsDadosAprovacao': {
                    'dsDadosAprovacao':

                        {
                            'prods:hasChanges': false,

                            'ttDadosAprovacao': [{

                                'susep': acao.susep,

                                'cpfCnpj': acao.cnpjCpf,

                                'tpColigacao': acao.tpColigacao,

                                'codColigacao': acao.codColigacao,

                                'codNovaSucursal': acao.codNovaSucursal,

                                'acao': acao.acao,

                                'motivoAcao': acao.motivoAcao,

                                'flgSerasa': false,

                                'idUsuario': acao.idUsuario

                            }],

                            'ttDadosTributos': [{

                                'municipioFiscal': acao.municipioFiscal,

                                'numIss': acao.numIss,

                                'flgRetemIss': true,

                                'datInIss': acao.datInIss,

                                'datFimIss': acao.datFimIss,

                                'numInscFiscal': acao.numInscFiscal,

                                'datMunIssIni': acao.datMunIssIni,

                                'datMunIssFim': acao.datMunIssFim

                            }]

                        }

                }
            }
        };

        return this.http.post(apiMethodUri, data, httpOptions);
    }

}
