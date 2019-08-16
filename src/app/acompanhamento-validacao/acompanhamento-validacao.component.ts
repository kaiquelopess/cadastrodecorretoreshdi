import {Component, OnInit} from '@angular/core';

// Services
import {AcompanhamentoService} from 'src/app/services/acompanhamento.service';
import {TokenService} from '../services/token.service';

@Component({
    selector: 'app-acompanhamento-validacao',
    templateUrl: './acompanhamento-validacao.component.html',
    styleUrls: ['./acompanhamento-validacao.component.css']
})
export class AcompanhamentoValidacaoComponent implements OnInit {

    constructor(private acompanhamentoService: AcompanhamentoService, private tokenService: TokenService) {
    }

    salvar: any = {
        susep: sessionStorage.getItem('codigoSusep'),
        cnpjCpf: sessionStorage.getItem('cnpjCpf')
    };

    passoAprovacao: any = [];
    aprovador: any = [];
    historico: any = [];
    situacao: '';

    ngOnInit() {

        this.tokenService.getToken().subscribe(
            (data: any) => {
                if (data.access_token) {
                    sessionStorage.setItem('token', data.access_token);
                }
            });

        this.acompanhamento(this.salvar);
    }

    acompanhamento(salvar: any) {

        this.acompanhamentoService.historicoAcompanhamento(salvar)
            .subscribe(
                (response: any) => {

                    const results = response.response.dsHistoricoProdutor.dsHistoricoProdutor;

                    this.historico = results.ttHistorico;
                    this.aprovador = results.ttAprovadorAtual;
                    this.passoAprovacao = results.ttPassoAprovacao;

                    if (results.ttPassoAprovacao) {
                        const situ = results.ttPassoAprovacao[0];
                        this.situacao = situ.situacao;

                        this.validaLegenda(this.situacao);
                    }
                });
    }

    validaLegenda(status) {
        if (status === 'Validação Não Iniciada') {
            return 0;
        } else if (status === 'Validação em Andamento') {
            return 1;
        } else if (status === 'Validação Negativa') {
            return 2;
        } else if (status === 'Validação Positiva') {
            return 3;
        }
    }
}
