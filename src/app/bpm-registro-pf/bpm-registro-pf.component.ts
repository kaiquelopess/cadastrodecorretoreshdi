import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { NgxSpinnerService } from 'ngx-spinner';

// Services
import { CepService } from 'src/app/services/cep.service';
import { ListaBancosService } from 'src/app/services/lista-bancos.service';
import { SucursaisService } from 'src/app/services/sucursais.service';
import { ConsultaDadosService } from 'src/app/services/consulta-dados.service';
import { ActivatedRoute } from '@angular/router';
import { TokenService } from '../services/token.service';
import { SusepCnpjService } from '../services/susep-cnpj.service';

@Component({
    selector: 'app-bpm-registro-pf',
    templateUrl: './bpm-registro-pf.component.html',
    styleUrls: ['./bpm-registro-pf.component.css']
})

export class BpmRegistroPfComponent implements OnInit {
    susep: string;
    cpfCnpj: string;
    cepReg: string;
    usuario: string;

    origem: number = 1;
    sucursais: any;
    bancos: any;
    cep: any;
    dados: any;
    sucursaisAtivas: any;
    sucursaisProx = [];
    itsCpf = false;
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
        numInss: '',
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
        cidade: '',
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
        sucursalAtiva: {},
        serasa: '',
        dvConta: '',
        dvAgencia: '',
        ciencia: false,
        simplesNacional: false
    };

    consultar: any;

    // Forms
    contactForm = this.formBuilder.group({
        susep: [{ value: '', disabled: true }],
        nome: [{ value: '', disabled: true }],
        sucursalAtiva: ['', Validators.required],
        cpfcnpj: [{ value: '', disabled: true }, [
            Validators.minLength(11),
            Validators.maxLength(14)
        ]],
        datNascPf: ['', Validators.required],
        inscInss: ['', Validators.required],
        sexo: ['', Validators.required],
        simplesNacional: [false],
        cep_cor: [{ value: '', disabled: true }, [
            Validators.minLength(8),
            Validators.maxLength(8)
        ]],
        endereco_cor: [{ value: '', disabled: true }],
        numero_cor: [{ value: '', disabled: true }],
        complemento_cor: [{ value: '', disabled: true }],
        bairro_cor: [{ value: '', disabled: true }],
        cidade_cor: [{ value: '', disabled: true }],
        uf_cor: [{ value: '', disabled: true }],
        codBanco: ['', Validators.required],
        codAgencia: ['', Validators.required],
        dvAgencia: ['', Validators.required],
        conta: ['', [
            Validators.required,
            Validators.max(11)
        ]],
        dvConta: ['', Validators.required],
        codCamara: ['', Validators.required],
        ciencia: [false]
    });

    hoje = '';

    cepForm = this.formBuilder.group({
        cepParam: ['', Validators.required]
    });

    constructor(
        private sucursaisService: SucursaisService,
        private listaBancosService: ListaBancosService,
        private cepService: CepService,
        private consultaDadosService: ConsultaDadosService,
        private spinnerService: NgxSpinnerService,
        private formBuilder: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private tokenService: TokenService,
        private susepCnpjService: SusepCnpjService)
        
        {
                this.susep = String(this.activatedRoute.snapshot.paramMap.get('susep'));
                this.cpfCnpj = String(this.activatedRoute.snapshot.paramMap.get('cpfCnpj'));
                this.usuario = String(this.activatedRoute.snapshot.paramMap.get('usuario'));
                this.origem = 1;
       
                
        this.sucursaisProx = [];
        this.maxDate();
    }

    maxDate() {
        var today = new Date();
        var dd: any = today.getDate();
        var mm: any = today.getMonth() + 1; //January is 0!
        var yyyy: any = today.getFullYear() - 18;
        if (dd < 10) {
            dd = '0' + dd
        }
        if (mm < 10) {
            mm = '0' + mm
        }

        this.hoje = yyyy + '-' + mm + '-' + dd;
    }

    ngOnInit() { 

        this.getBrokerData();
        this.getBancos();
        this.consultaDados();
        this.sucAtivas();
     }

    getSucursais() {

        const codigoSusep = sessionStorage.getItem('codigoSusep');
        const cpnjCpf = sessionStorage.getItem('cnpjCpf');

        this.sucursaisService.getSucursais(this.origem, codigoSusep, cpnjCpf)
            .subscribe(
                (response: any) => this.sucursais = response.DadosSucursais.ttDadosSucursal,
                (error: any) => alert(error.statusText)
            );
    }

    adicionarSucursal(): any {
        throw new Error('Method not implemented.');
    }

    getBancos() {

        this.listaBancosService.getBancos()
            .subscribe(
                (response: any) => {
                    this.bancos = response.response.dsBancos.DsBancos.ttBancos
                        .filter((banco: any) => {
                            return banco.flgAtivo === true;

                        });

                        
                },
                (error: any) => {
                    alert(error.statusText);
                });
    }

    adicionarBancos(): any {
        throw new Error('Method not implemented.');
    }

    // getCep() {

    //     this.spinnerService.show();
    //     this.validaCep();

    //     let results: any;
    //     this.cepService.getCep(this.cepForm.value.cepParam)
    //         .subscribe(
    //             (response: any) => {
    //                 results = response.results[0];

    //                 if (!results) {
    //                     this.spinnerService.hide();
    //                     alert('Informe um CEP válido.');
    //                     return;
    //                 }

    //                 this.salvar.latitude = results.geometry.location.lat;
    //                 this.salvar.longitude = results.geometry.location.lng;

    //                 this.getSucursaisProx();
    //             },
    //             () => {
    //                 this.spinnerService.hide();
    //                 alert('Não foi possível obter a lista de sucursais. Tente novamente mais tarde.');
    //             }
    //         );
    // }


    getSucursaisProx() {

        let results: any;

        this.cepService.getSucursaisProx(this.salvar.latitude, this.salvar.longitude)
            .subscribe(
                (response: any) => {
                    results = response.sucursais;
                    this.sucursaisProx = results
                        .filter((sucursal: any) => {
                            return sucursal.Tipo === 'S';
                        });

                    this.spinnerService.hide();

                    alert('Agora escolha a sucursal');
                },
                (error: any) => {
                    this.spinnerService.hide();
                    alert(error.statusText);
                });
    }

    sucAtivas() {

        this.consultaDadosService.consultaDados(this.susep, this.cpfCnpj).subscribe(
            (response: any) => {

                let results = response.response.dsDadosProdutor.dsDadosProdutor.ttDadosProdutor[0];

                this.salvar.sucursalAtiva = results.nomSucursal;

                this.sucursaisService.getSucursais(this.origem, this.susep, this.cpfCnpj).subscribe(
                    response => {
                        let results = response.DadosSucursais.ttDadosSucursal;
                        this.sucursaisAtivas = results;
                        // this.sucursaisAtivas = results.filter(function (sucAtiva) {
                        //  return sucAtiva.Situacao === "Ativo"
                        // });
                        this.pagination.totalItems = this.sucursaisAtivas.length;
                    }),
                    error => {
                        alert(error.statusText);
                    };

            }
        )
    }

    validaCep(): any {
        if (!(this.cepForm.value.cepParam.trim().length == 8)) {
            this.spinnerService.hide();
            return alert('CEP inválido!');
        }
    }

    onSubmit(idTab: any) {
        if (!this.contactForm.value.ciencia) {
            alert('Para dar continuidade, favor assinalar a ciência das informações');
            return false;
        }

        const errors = this.validateErrors();

        if (errors.length > 0) {
            alert('Preencha todos os dados obrigatórios corretamente para continuar:\n\n' + errors);
            return false;
        }

        this.spinnerService.show();
        this.mapForm();

        // this.salvarDadosService.salvarDados(this.salvar)
        //     .subscribe(
        //         (data: any) => {
        //             // INFO: O que deveria fazer?
        //             // this.consultaDados();

        //             const message = data.response.dsDadosProdutor.dsDadosProdutor.ttblmensagem[0];

        //             if (message.Codigo === '002')
        //                 alert(message.Descricao);
        //             else {
        //                 $('.nav-tabs a[href="#' + idTab + '"]').tab('show');
        //                 this.spinnerService.hide();
        //             }
        //         },
        //         (error: any) => {
        //             this.spinnerService.hide();
        //             alert(error.statusText);
        //         });
    }

    // salvarDados(idTab: any) {

    //     this.salvarDadosService.salvarDados(this.salvar).subscribe(
    //         response => {
    //             this.salvar = response.response.dsDadosProdutor.dsDadosProdutor.ttDadosProdutor;
    //             this.salvar.ttUsuario;
    //             this.consultaDados();
    //             $('.nav-tabs a[href="#' + idTab + '"]').tab('show');

    //         },
    //         error => {
    //             alert(error.statusText);
    //         }
    //     );

    // }

    consultaDados() {

        this.spinnerService.show();

        this.cepReg = sessionStorage.getItem('cep');

        this.contactForm.setValue({
            susep: sessionStorage.getItem('codigoSusep'),
            nome: sessionStorage.getItem('nomecorretor'),
            cpfcnpj: sessionStorage.getItem('cnpjCpf'),
            datNascPf: sessionStorage.getItem('datNascPf'),
            inscInss: sessionStorage.getItem('inscInss'),
            sexo: sessionStorage.getItem('sexo'),
            simplesNacional: sessionStorage.getItem('simplesNacional'),
            sucursalAtiva: sessionStorage.getItem('codSucursal'),
            cep_cor: sessionStorage.getItem('cep'),
            endereco_cor: sessionStorage.getItem('endereco'),
            numero_cor: sessionStorage.getItem('numero'),
            complemento_cor: sessionStorage.getItem('complemento'),
            bairro_cor: sessionStorage.getItem('bairro'),
            cidade_cor: sessionStorage.getItem('cidade'),
            uf_cor: sessionStorage.getItem('uf'),
            codBanco: sessionStorage.getItem('banco'),
            codAgencia: sessionStorage.getItem('agencia'),
            dvAgencia: sessionStorage.getItem('dvAgencia'),
            conta: sessionStorage.getItem('conta'),
            dvConta: sessionStorage.getItem('dvConta'),
            codCamara: sessionStorage.getItem('camara'),
            ciencia: false
        });

        this.spinnerService.hide();
    }

    getBrokerData() {

        this.consultaDadosService.consultaDados(this.susep, this.cpfCnpj).subscribe(
            (response: any) => {
                let results = response.response.dsDadosProdutor.dsDadosProdutor;
                let user = response.response.dsDadosProdutor.dsDadosProdutor;

                if (results.ttblmensagem[0].Codigo.toString() === '002')
                    return alert(results.ttblmensagem[0].Descricao.toString());
                else {
                    results = results.ttDadosProdutor[0];
                    let users = user.ttDadosProdutor[0];

                    sessionStorage.setItem('numseq', results.numseq);
                    sessionStorage.setItem('cnpjCpf', results.cpfcnpj);

                    if (results.cpfcnpj.toString().length <= 11) {
                        this.itsCpf = true;
                    }

                    sessionStorage.setItem('situacao', results.situacao);
                    sessionStorage.setItem('numInss', results.numInss);
                    sessionStorage.setItem('datNascPf', results.dataNasc);
                    sessionStorage.setItem('sexo', results.sexo);
                    sessionStorage.setItem('banco', results.codBanco);
                    sessionStorage.setItem('agencia', results.codAgencia);
                    sessionStorage.setItem('dvAgencia', results.dvAgencia);
                    sessionStorage.setItem('conta', results.conta);
                    sessionStorage.setItem('dvConta', results.dvConta);
                    sessionStorage.setItem('camara', results.codCamara);
                    sessionStorage.setItem('codSucursal', results.codSucursal);
                    sessionStorage.setItem('nomSucursal', results.nomSucursal);

                    sessionStorage.setItem('nomecorretor', results.nome);
                    sessionStorage.setItem('contatocorretor', users.nome);

                    sessionStorage.setItem('cep', results.cep);
                    sessionStorage.setItem('endereco', results.endereco);
                    sessionStorage.setItem('bairro', results.bairro);
                    sessionStorage.setItem('numero', results.numero);
                    sessionStorage.setItem('complemento', results.complemento);
                    sessionStorage.setItem('municipio', results.municipio);
                    sessionStorage.setItem('uf', results.uf);

                    sessionStorage.setItem('telComercial', results.telComercial);
                    sessionStorage.setItem('telCelular', results.telCelular);

                    sessionStorage.setItem('email', results.email);
                    sessionStorage.setItem('emailSin', results.emailSin);
                    sessionStorage.setItem('emailExt', results.emailExt);
                    sessionStorage.setItem('emailNotaFiscal', results.emailNf);

                    sessionStorage.setItem('simplesNacional', results.simplesNacional);

                    this.salvar.codBanco = results.codBanco;
                    this.salvar.codAgencia = results.codAgencia;
                    this.salvar.codCamara = results.codCamara;
                    this.salvar.conta = results.conta;
                    this.salvar.dvAgencia = results.dvAgencia;
                    this.salvar.dvConta = results.dvConta;
                    this.salvar.telCelular = results.telCelular;
                    this.salvar.telComercial = results.telComercial;
                    this.salvar.sexo = results.sexo;

                    this.salvar.susep = results.susep;
                    this.salvar.nome = results.nome;
                    this.salvar.cpfcnpj = results.cpfcnpj;
                    this.salvar.numInss = results.numInss;
                    this.salvar.dataNasc = results.dataNasc;
    
                    this.salvar.cep = results.cep;
                    this.salvar.endereco = results.endereco;
                    this.salvar.bairro = results.bairro;
                    this.salvar.numero = results.numero;
                    this.salvar.complemento = results.complemento;
                    this.salvar.municipio = results.municipio;
                    this.salvar.uf = results.uf;
                    this.salvar.simplesNacional = results.simplesNacional;
                    
                }

              

            },
            error => {
                alert(error.statusText);
            });
    }

    pageChanged(page) {
        this.pagination.currentPage = page;
        this.sucAtivas();
    }

    mapForm() {

        const data = this.contactForm.getRawValue();

        this.salvar.susep = data.susep;
        this.salvar.nome = data.nome;
        this.salvar.datNascPf = data.datNascPf;
        this.salvar.inscInss = data.inscInss;
        this.salvar.sexo = data.sexo;
        this.salvar.cpfcnpj = data.cpfcnpj;
        this.salvar.cep = data.cep;
        this.salvar.endereco = data.endereco;
        this.salvar.numero = data.numero;
        this.salvar.complemento = data.complemento;
        this.salvar.bairro = data.bairro;
        this.salvar.cidade = data.cidade;
        this.salvar.uf = data.uf;
        this.salvar.simplesNacional = data.simplesNacional;
        this.salvar.codBanco = data.codBanco;
        this.salvar.codAgencia = data.codAgencia;
        this.salvar.dvAgencia = data.dvAgencia;
        this.salvar.conta = data.conta;
        this.salvar.dvConta = data.dvConta;
        this.salvar.codCamara = data.codCamara;
        this.salvar.sucursalAtiva = data.sucursalAtiva;
        this.salvar.situacao = "1";
        this.salvar.cod_empresa = sessionStorage.getItem('cod_empresa');
        sessionStorage.setItem('codSucursal', data.sucursalAtiva);
    }

    validateErrors() {

        let errors = '';

        if (this.contactForm.controls.inscInss.errors)
            errors += 'O campo Inscrição do INSS está vazio.\n';

        if (this.contactForm.controls.datNascPf.errors)
            errors += 'O campo Data de Nascimento está vazio.\n';

        if (this.contactForm.controls.sexo.errors)
            errors += 'O campo Sexo está vazio.\n';

        if (this.contactForm.controls.sucursalAtiva.errors)
            errors += 'É obrigatório escolher uma Sucursal.\n';

        if (this.contactForm.controls.codBanco.errors)
            errors += 'É obrigatório escolher um Banco.\n';

        if (this.contactForm.controls.codAgencia.errors) {

            if (this.contactForm.controls.codAgencia.errors.required)
                errors += 'O campo Agência está vazio.\n';

            if (this.contactForm.controls.codAgencia.errors.minlength)
                errors += 'Informe uma Agência válida.\n';
        }

        if (this.contactForm.controls.dvAgencia.errors)
            errors += 'O campo Dígito Verificador da Agência está vazio.\n';

        if (this.contactForm.controls.conta.errors) {
            if (this.contactForm.controls.conta.errors.required)
                errors += 'O campo Conta está vazio.\n';

            if (this.contactForm.controls.conta.errors.minlength)
                errors += 'Informe uma Conta válida.\n';
        }

        if (this.contactForm.controls.dvConta.errors)
            errors += 'O campo Dígito Verificador da Conta está vazio.\n';

        if (this.contactForm.controls.codCamara.errors) {
            if (this.contactForm.controls.codCamara.errors.required)
                errors += 'O campo Câmara de Compensação está vazio.\n';

            if (this.contactForm.controls.codCamara.errors.minlength)
                errors += 'Informe uma Câmara de Compensação válida.\n';
        }

        return errors;
    }

   
}
