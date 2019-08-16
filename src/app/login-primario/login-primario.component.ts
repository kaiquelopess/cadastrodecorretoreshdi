import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

// Services
import {SusepCnpjService} from '../services/susep-cnpj.service';
import {TokenService} from '../services/token.service';
import {ValidadorDocumentoService} from '../services/utils/validador-documento.service';
import {ConsultaOrigemService} from '../services/consulta-origem.service';

@Component({
    selector: 'app-login-primario',
    templateUrl: './login-primario.component.html',
    styleUrls: ['./login-primario.component.css']
})

export class LoginPrimarioComponent implements OnInit, OnDestroy {

    private ngUnsubscribe = new Subject();

    itsCpf = false;
    origem: string;

    formulario: any = {
        registroSusep: '',
        cnpjCpf: ''
    };

    dados: any = {
        susep: '',
        cpfcnpj: '',
        nome: '',
        numInss: '',
        sexo: '',
        dataNasc: '',
        cep: '',
        endereco: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        uf: ''
    };

    constructor(
        private validadorDocumentoService: ValidadorDocumentoService,
        private tokenService: TokenService,
        private susepCnpjService: SusepCnpjService,
        private spinnerService: NgxSpinnerService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private consultaOrigemService: ConsultaOrigemService) {}

    ngOnInit() {
        this.origem = sessionStorage.getItem('cod_empresa');
    }

    validar(): any {
        if (this.formulario.registroSusep.length < 14) {
            this.padSusep();
        }

        if ((this.formulario.registroSusep.trim() === '') || (this.formulario.cnpjCpf.trim() === '')) {
            return alert('Por favor preencha todos os campos obrigatórios!');
        }

        if (!this.verificaCnpjCpf(this.formulario.cnpjCpf.trim())) {
            return alert('Código SUSEP e CPF/CNPJ nao consta na tabela SUSEP!');
        }

        this.spinnerService.show();

        this.tokenService.getToken()
            .subscribe(
                (data: any) => {
                    sessionStorage.setItem('token', data.access_token);
                    sessionStorage.setItem('codigoSusep', this.formulario.registroSusep.trim());
                    this.origem = sessionStorage.getItem('cod_empresa');

                    this.susepCnpjService.getSusep(this.origem, this.formulario.registroSusep.trim(), this.formulario.cnpjCpf.trim())
                        .subscribe((data: any) => {
                                let errorMsg = '';

                                if (data.DadosSusep.Mensagem.length === 0) {
                                    errorMsg = 'Ocorreu um erro desconhecido ao tentar efetuar o login!';
                                } else if (data.DadosSusep.Mensagem[0].Codigo === '002') {
                                    errorMsg = data.DadosSusep.Mensagem[0].Descricao;
                                    this.router.navigate(['/login/' + this.origem], {queryParamsHandling: 'preserve'});
                                }

                                if (errorMsg !== '') {
                                    alert(errorMsg);
                                } else {
                                    sessionStorage.setItem('codigoSusep', this.formulario.registroSusep.trim());
                                    sessionStorage.setItem('origem', this.origem.toString());

                                    sessionStorage.setItem('numseq', '200');
                                    sessionStorage.setItem('nomecorretor', data.DadosSusep.ttDadosSusep[0].nomecorretor);
                                    sessionStorage.setItem('tipopessoa', data.DadosSusep.ttDadosSusep[0].tipopessoa);
                                    sessionStorage.setItem('endereco', data.DadosSusep.ttDadosSusep[0].endereco);
                                    sessionStorage.setItem('numero', data.DadosSusep.ttDadosSusep[0].numero);
                                    sessionStorage.setItem('complemento', data.DadosSusep.ttDadosSusep[0].complemento);
                                    sessionStorage.setItem('bairro', data.DadosSusep.ttDadosSusep[0].bairro);
                                    sessionStorage.setItem('cidade', data.DadosSusep.ttDadosSusep[0].cidade);
                                    sessionStorage.setItem('uf', data.DadosSusep.ttDadosSusep[0].uf);
                                    sessionStorage.setItem('cep', data.DadosSusep.ttDadosSusep[0].cep.padStart(8, '0'));
                                    sessionStorage.setItem('telefone', data.DadosSusep.ttDadosSusep[0].telefone);

                                    this.router.navigate(['/app-primeiro-acesso/' + this.origem], {queryParamsHandling: 'preserve'});
                                }

                                this.spinnerService.hide();
                            },
                            () => {
                                sessionStorage.clear();
                                alert('Ocorreu um erro na validação. Por favor tente novamente.');
                                this.spinnerService.hide();
                            });
                },
                () => {
                    sessionStorage.clear();
                    alert('Ocorreu um erro na validação. Por favor tente novamente.');
                    this.spinnerService.hide();
                }
            );
    }

    setCnpjCpf(cnpjCpf: string) {
        cnpjCpf = cnpjCpf.split('/').join('');
        cnpjCpf = cnpjCpf.split('-').join('');
        cnpjCpf = cnpjCpf.split('.').join('');

        sessionStorage.setItem('cnpjCpf', cnpjCpf);

        if (cnpjCpf.length === 0 || cnpjCpf.length === 11 || cnpjCpf.length === 14) {
            this.formulario.cnpjCpf = cnpjCpf;
        }
    }

    verificaCnpjCpf(cnpjCpf: string): boolean {

        let result = false;

        if (cnpjCpf.length === 11) {
            if (this.validadorDocumentoService.validaCpf(cnpjCpf)) {
                this.itsCpf = true;
                result = true;
            }
        } else if (cnpjCpf.length === 14) {
            result = this.validadorDocumentoService.validaCnpj(cnpjCpf);
        }

        return result;
    }

    async dadosForm() {
        let results: any;

        this.susepCnpjService.getSusep(this.origem, this.formulario.registroSusep, this.formulario.cnpjCpf)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((response: any) => {

                    results = response.DadosSusep;

                    if (response.DadosSusep.Mensagem[0].Codigo === '002') {
                        alert(response.DadosSusep.Mensagem[0].Descricao);
                        this.router.navigate(['/login/' + this.origem]);
                        this.ngOnDestroy();
                    } else {

                        results = results.ttDadosSusep[0];

                        sessionStorage.setItem('numseq', results.numseq);
                        sessionStorage.setItem('codsusep', results.codsusep);
                        sessionStorage.setItem('nomecorretor', results.nomecorretor);
                        sessionStorage.setItem('cpfcnpj', results.cpfcnpj);
                        sessionStorage.setItem('cep', results.cep);
                        sessionStorage.setItem('endereco', results.endereco);
                        sessionStorage.setItem('bairro', results.bairro);
                        sessionStorage.setItem('numero', results.numero);
                        sessionStorage.setItem('complemento', results.complemento);
                        sessionStorage.setItem('cidade', results.cidade);
                        sessionStorage.setItem('uf', results.uf);
                        sessionStorage.setItem('simplesNacional', 'false');
                        sessionStorage.setItem('situacao', '1');

                        this.dados.susep = results.codsusep;
                        this.dados.nome = results.nomecorretor;
                        this.dados.cpfcnpj = results.cpfcnpj;
                        this.dados.cep = results.cep.padStart(8, 0);
                        this.dados.endereco = results.endereco;
                        this.dados.bairro = results.bairro;
                        this.dados.numero = results.numero;
                        this.dados.complemento = results.complemento;
                        this.dados.cidade = results.cidade;
                        this.dados.uf = results.uf;
                        this.dados.simplesNacional = results.simplesNacional;
                    }
                },
                (error: any) => {
                    alert(error.statusText);
                });
    }

    padSusep() {
        if (this.formulario.registroSusep.toString() !== '') {
            const susep = this.formulario.registroSusep.toString().replace(/[^0-9]*|[!@#$%*&(){}\[\]:;/\\,?<>+=_\.-|]/g, '');
            this.formulario.registroSusep = susep.padStart(14, 0);
        }
    }

    consultaOrigem(origem: number) {

        this.tokenService.getToken()
            .subscribe(
                (data: any) => {
                    sessionStorage.setItem('token', data.access_token);

                    this.consultaOrigemService.consultaOrigem(origem).subscribe(
                        (response: any) => {
                            let results = response.DadosOrigem.Mensagem[0];
                            this.consultaOrigem = results;

                            sessionStorage.setItem('origem', origem.toString());
                        },

                        (error: any) => alert(error.statusText)
                    );
                }
            );
    }

    possuiUsuarioSenha() {
        this.router.navigate(['app-ja-sou-cadastrado/' + this.origem], {queryParamsHandling: 'preserve'});
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
