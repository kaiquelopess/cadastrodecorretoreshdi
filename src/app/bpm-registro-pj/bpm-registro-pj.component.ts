import { CepService } from 'src/app/services/cep.service';
import { ListaBancosService } from 'src/app/services/lista-bancos.service';
import { HttpClient } from '@angular/common/http';
import { SucursaisService } from 'src/app/services/sucursais.service';
import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { environment } from 'src/environments/environment';
import { ConsultaDadosService } from 'src/app/services/consulta-dados.service';
import { Pipe, PipeTransform } from '@angular/core';
import { Alert } from 'selenium-webdriver';
import { TestingCompiler } from '@angular/core/testing/src/test_compiler';
import { nextContext } from '@angular/core/src/render3';
import { SusepCnpjService } from 'src/app/services/susep-cnpj.service';
import { build$$ } from 'protractor/built/element';
import { NgxMaskModule } from 'ngx-mask';
import { ConsultaOrigemService } from 'src/app/services/origem.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-bpm-registro-pj',
    templateUrl: './bpm-registro-pj.component.html',
    styleUrls: ['./bpm-registro-pj.component.css']
})
export class BpmRegistroPjComponent implements OnInit {
    origem: number;
    usuario: string;
    sucursais: any;
    bancos: any;
    cep: any;
    sucursaisProx: any;
    dados: any;
    sucursaisAtivas: any;
    salvarDados: any = [];
    susep: string;
    cpfCnpj: string;
    nomSucursal: '';

    pagination = {
        currentPage: 1,
        totalItems: 0,
        itemsPerPage: 10
    };

    salvar: any = {
        susep: '',
        cpfcnpj: '',
        nome: '',
        inscInss: '',
        situacao: '',
        codBanco: '',
        codAgencia: '',
        codCamara: '',
        cpf: '',
        numseq: '',
        dtNasc: '',
        conta: '',
        sexo: '',
        dataNasc: '',
        camara: '',
        cep: '',
        endereco: '',
        numero: '',
        complemento: '',
        bairro: '',
        municipio: '',
        uf: '',
        sucAtiva: {},
        codigoSusep: '',
        sucursal: {},
        banco: {},
        cepParam: '',
        sucursaisProx: {},
        latitude: '',
        longitude: '',
        address: '',
        sucursalAtiva: '',
        serasa: '',
        simplesNacional: false,
        dvConta: '',
        dvAgencia: '',
        ciencia: false
    };

    consultar: {};

    validadorDocumentoService: any;

    constructor(
        private tokenService: TokenService,
        private SucursaisService: SucursaisService,
        private HttpClient: HttpClient,
        private ListaBancosService: ListaBancosService,
        private CepService: CepService,
        private consultaDadosService: ConsultaDadosService,
        private ConsultaOrigemService: ConsultaOrigemService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private susepCnpjService: SusepCnpjService

    ) {
        
        this.susep = String(this.activatedRoute.snapshot.paramMap.get('susep'));
        this.cpfCnpj = String(this.activatedRoute.snapshot.paramMap.get('cpfCnpj'));
        this.usuario = String(this.activatedRoute.snapshot.paramMap.get('usuario'));
        this.origem = 1;
        
    }

    ngOnInit() { 

        // this.dadosPessoais();
        this.getBancos();
        this.obterDados();
        this.sucAtivas();
    }
    


    getSucursais() {

        this.SucursaisService.getSucursais(this.origem, this.susep, this.cpfCnpj).subscribe(
            response => {
                this.sucursais = response.DadosSucursais.ttDadosSucursal;
            },
            error => {
                alert(error.statusText);
            }
        );
    }

    adicionarSucursal(): any {
        throw new Error('Method not implemented.');
    }

    getBancos() {

        this.ListaBancosService.getBancos().subscribe(
            response => {
                this.bancos = response.response.dsBancos.DsBancos.ttBancos.filter(function (banco) {
                    return banco.flgAtivo === true;

                });
            }),

            error => {
                alert(error.statusText);
            };
    }

    adicionarBancos(): any {
        throw new Error('Method not implemented.');
    }

    // getCep() {
    //     this.CepService.getCep(this.salvar.cepParam).subscribe(
    //         response => {
    //           let results = response.results[0];

    //             this.salvar.latitude = results.geometry.location.lat;
    //             this.salvar.longitude = results.geometry.location.lng;

    //             this.getSucursaisProx();
    //         },
    //         error => {
    //             alert(error.statusText);
    //         }
    //     );
    // }

    getSucursaisProx() {

        let results: any;
        this.CepService.getSucursaisProx(this.salvar.latitude, this.salvar.longitude).subscribe(
            response => {
                results = response.sucursais;
                this.sucursaisProx = results.filter(function (sucursal) {
                    return sucursal.Tipo === 'S';
                });
                alert('Agora escolha a sucursal!');
            }),
            error => {
                alert(error.statusText);
            };
    }

    sucAtivas() {


        this.consultaDadosService.consultaDados(this.susep, this.cpfCnpj).subscribe(
            (response: any) => {

                let results = response.response.dsDadosProdutor.dsDadosProdutor.ttDadosProdutor[0];

                this.salvar.sucursalAtiva = results.nomSucursal;


                this.SucursaisService.getSucursais(this.origem, this.susep, this.cpfCnpj).subscribe(
                    response => {
                        let results = response.DadosSucursais.ttDadosSucursalCorretor;
                        this.sucursaisAtivas = results;
                        //this.sucursaisAtivas = results.filter(function (sucAtiva) {
                        //  return sucAtiva.Situacao === "Ativo"
                        //});
                        this.pagination.totalItems = this.sucursaisAtivas.length;
                    }),
                    error => {
                        alert(error.statusText);
                    };

            }
        )

    }

    validaCep(): any {
        if (this.salvar.cep.trim() == '') {
            alert('Favor digitar o CEP!');

            return;
        }

        if (!this.verificaCep(this.salvar.cep.trim())) {
            alert('CNPJ/CPF inválido!');

            return;
        }
    }


    verificaCep(cep: any): any {
        if (this.salvar.cep.trim().length == 8) {
            if (this.validadorDocumentoService.validaCep(this.salvar.cep.trim())) {
                return true;
            } else {
                return false;
            }
        }
    }


    // salvarDados(idTab: any) {

    //     debugger;

    //     if (!this.salvar.ciencia) {
    //         alert('Ops!! Para dar continuidade, favor assinalar a ciência das informações');
    //         return false;
    //     }

    //     this.SalvarDadosService.salvarDados(this.salvar).subscribe(
    //         response => {
    //             let data = response.response.dsDadosProdutor.dsDadosProdutor.ttDadosProdutor[0];
    //             //this.salvar.ttUsuario;

    //             this.consultaDados();
    //             $('.nav-tabs a[href="#' + idTab + '"]').tab('show');

    //         },
    //         error => {
    //             alert(error.statusText);
    //         }
    //     );

    // }

    consultaDados() {

        this.consultaDadosService.consultaDados(this.susep, this.cpfCnpj).subscribe(
            response => {
                this.consultar = response.response.dsDadosProdutor.dsDadosProdutor;
            },
            error => {
                alert(error.statusText);
            }
        );
    }

    pageChanged(page) {
        this.pagination.currentPage = page;
        this.sucAtivas();
    }



    // dadosPessoais() {

    //     this.origem = 1;
    //     this.susepCnpjService.getSusep(this.origem, this.susep, this.cpfCnpj).subscribe(
    //         response => {

    //             if (response.DadosSusep.Mensagem[0].Codigo === "002") {
    //                 return
    //             }

    //             let resultss = response.DadosSusep;

    //             let results = resultss.ttDadosSusep[0];

    //             sessionStorage.setItem('codsusep', results.codsusep);
    //             sessionStorage.setItem('nome', results.nome);
    //             sessionStorage.setItem('cpfcnpj', results.cpfcnpj);

    //             sessionStorage.setItem('cep', results.cep);
    //             sessionStorage.setItem('endereco', results.endereco);
    //             sessionStorage.setItem('bairro', results.bairro);
    //             sessionStorage.setItem('numero', results.numero);
    //             sessionStorage.setItem('complemento', results.complemento);
    //             sessionStorage.setItem('municipio', results.municipio);
    //             sessionStorage.setItem('uf', results.uf);


    //             this.salvar.susep = results.codsusep;
    //             this.salvar.nome = results.nomecorretor;
    //             this.salvar.cpfcnpj = results.cpfcnpj;

    //             this.salvar.cep = results.cep;
    //             this.salvar.endereco = results.endereco;
    //             this.salvar.bairro = results.bairro;
    //             this.salvar.numero = results.numero;
    //             this.salvar.complemento = results.complemento;
    //             this.salvar.municipio = results.municipio;
    //             this.salvar.uf = results.uf;

    //             this.salvar.codBanco = results.codBanco;
    //             this.salvar.codAgencia = results.codAgencia;
    //             this.salvar.codCamara = results.codCamara;
    //             this.salvar.conta = results.conta;
    //             this.salvar.dvAgencia = results.dvAgencia;
    //             this.salvar.dvConta = results.dvConta;
    //             this.salvar.telCelular = results.telCelular;
    //             this.salvar.telComercial = results.telComercial;

    //         },
    //         error => {
    //             alert(error.statusText);
    //         }
    //     );
    // }

    obterDados() {

        this.consultaDadosService.consultaDados(this.susep, this.cpfCnpj).subscribe(
            response => {

                let results = response.response.dsDadosProdutor.dsDadosProdutor.ttDadosProdutor[0];



                sessionStorage.setItem('susep', results.susep);
                sessionStorage.setItem('nome', results.nome);
                sessionStorage.setItem('cpfcnpj', results.cpfcnpj);

                sessionStorage.setItem('cep', results.cep);
                sessionStorage.setItem('endereco', results.endereco);
                sessionStorage.setItem('bairro', results.bairro);
                sessionStorage.setItem('numero', results.numero);
                sessionStorage.setItem('complemento', results.complemento);
                sessionStorage.setItem('municipio', results.municipio);
                sessionStorage.setItem('uf', results.uf);

                sessionStorage.setItem('agencia', results.codAgencia);
                sessionStorage.setItem('dvAgencia', results.dvAgencia);
                sessionStorage.setItem('conta', results.conta);
                sessionStorage.setItem('dvConta', results.dvConta);
                sessionStorage.setItem('camara', results.codCamara);


                this.salvar.codBanco = results.codBanco;
                this.salvar.codAgencia = results.codAgencia;
                this.salvar.codCamara = results.codCamara;
                this.salvar.conta = results.conta;
                this.salvar.dvAgencia = results.dvAgencia;
                this.salvar.dvConta = results.dvConta;
                this.salvar.telCelular = results.telCelular;
                this.salvar.telComercial = results.telComercial;
                this.salvar.simplesNacional = results.simplesNacional;


                this.salvar.susep = sessionStorage.getItem('susep');
                this.salvar.nome = sessionStorage.getItem('nome');
                this.salvar.cpfcnpj = sessionStorage.getItem('cpfcnpj');

                this.salvar.cep = sessionStorage.getItem('cep');
                this.salvar.endereco = sessionStorage.getItem('endereco');
                this.salvar.numero = sessionStorage.getItem('numero');
                this.salvar.complemento = sessionStorage.getItem('complemento');
                this.salvar.bairro = sessionStorage.getItem('bairro');
                this.salvar.municipio = sessionStorage.getItem('municipio');
                this.salvar.uf = sessionStorage.getItem('uf');

                this.salvar.serasa = sessionStorage.getItem('serasa');
            });
    }

}


