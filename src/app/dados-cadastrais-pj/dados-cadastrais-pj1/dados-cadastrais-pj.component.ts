import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { NgxSpinnerService } from 'ngx-spinner';

// Services
import { CepService } from '../../services/cep.service';
import { ListaBancosService } from '../../services/lista-bancos.service';
import { SucursaisService } from '../../services/sucursais.service';
import { SalvarDadosService } from 'src/app/services/salvar-dados.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-dados-cadastrais-pj',
    templateUrl: './dados-cadastrais-pj.component.html',
    styleUrls: ['./dados-cadastrais-pj.component.css']
})

export class DadosCadastraisPjComponent implements OnInit {
    origem: string;
    sucursais: any;
    bancos: any;
    cep: any;
    dados: any;
    sucursaisAtivas: any;
    sucursaisProx = [];

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
        simplesNacional: '',
        dvConta: '',
        dvAgencia: '',
        ciencia: false
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

    cepForm = this.formBuilder.group({
        cepParam: ['', Validators.required]
    });

    constructor(
        private sucursaisService: SucursaisService,
        private listaBancosService: ListaBancosService,
        private cepService: CepService,
        private salvarDadosService: SalvarDadosService,
        private spinnerService: NgxSpinnerService,
        private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute) {

        this.sucursaisProx = [];
        this.consultaDados();
    }

    ngOnInit() {
        this.origem = sessionStorage.getItem('origem');

        this.sucursaisSalvas();
        this.sucAtivas();
        this.getBancos();

        // this.obterDados();
    }

    sucursaisSalvas() {

        this.sucursaisProx.push({
            'CodSucursal': sessionStorage.getItem('codSucursal'),
            'Nome': sessionStorage.getItem('nomSucursal')
        });
    }

    getSucursais() {

        var codigoSusep = sessionStorage.getItem('codigoSusep');
        var cpnjCpf = sessionStorage.getItem('cnpjCpf');

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

        this.listaBancosService.getBancos().subscribe(
            (response: any) => {
                this.bancos = response.response.dsBancos.DsBancos.ttBancos.filter((banco: any) => {
                    return banco.flgAtivo === true;
                });
            }),
            (error: any) => alert(error.statusText);
    }

    adicionarBancos(): any {
        throw new Error('Method not implemented.');
    }

    getCep() {

        this.spinnerService.show();
        this.validaCep();

        let results: any;
        this.cepService.getCep(this.cepForm.value.cepParam)
            .subscribe(
                (response: any) => {
                    results = response.results[0];

                    if (!results) {
                        this.spinnerService.hide();
                        alert('Informe um CEP válido.');
                        return;
                    }

                    this.salvar.latitude = results.geometry.location.lat;
                    this.salvar.longitude = results.geometry.location.lng;

                    this.getSucursaisProx();
                },
                () => {
                    this.spinnerService.hide();
                    alert('Não foi possível obter a lista de sucursais. Tente novamente mais tarde.');
                }
            );
    }

    getSucursaisProx() {

        let results: any;

        this.cepService.getSucursaisProx(this.salvar.latitude, this.salvar.longitude)
            .subscribe(
                (response: any) => {
                    results = response.sucursais;
                    this.sucursaisProx = results
                        .filter((sucursal: any) => {
                            return sucursal.Tipo === 'S' && sucursal.CodSucursal != '5';
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

        this.sucursaisService.getSucursais(this.origem, this.salvar.susep, this.salvar.cpfcnpj).subscribe(
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

        this.salvarDadosService.salvarDados(this.salvar)
            .subscribe(
                (data: any) => {
                    // INFO: O que deveria fazer?
                    // this.consultaDados();

                    const message = data.response.dsDadosProdutor.dsDadosProdutor.ttblmensagem[0];
                    const erroSucursal = data.response.dsDadosProdutor.dsDadosProdutor.ttDadosProdutor[0];
                    if (erroSucursal.codSucursal === "null") {
                        alert("Houve um problema com sua sucursal, favor entrar em contato com uma filial da HDI");
                        this.spinnerService.hide();
                        return;
                    }

                    if (message.Codigo === '002') {
                        this.spinnerService.hide();
                        alert(message.Descricao);
                    }
                    else {

                        this.salvarDadosService.updateSessionStorage(data.response.dsDadosProdutor.dsDadosProdutor.ttDadosProdutor[0]);

                        this.router.navigate(['../dados-cadastrais-pj2'], { relativeTo: this.route });

                        // $('.nav-tabs a[href="#' + idTab + '"]').tab('show');
                        this.spinnerService.hide();
                    }
                },
                (error: any) => {
                    this.spinnerService.hide();
                    alert(error.statusText);
                });
    }

    /*updateSessionStorage(data) {

        const corretor = data.response.dsDadosProdutor.dsDadosProdutor.ttDadosProdutor[0];

        sessionStorage.setItem('simplesNacional', corretor.simplesNacional);
        sessionStorage.setItem('codSucursal', corretor.codSucursal);
        sessionStorage.setItem('cep', corretor.cep);
        sessionStorage.setItem('endereco', corretor.endereco);
        sessionStorage.setItem('numero', corretor.numero);
        sessionStorage.setItem('complemento', corretor.endereco);
        sessionStorage.setItem('bairro', corretor.bairro);
        sessionStorage.setItem('cidade', corretor.municipio);
        sessionStorage.setItem('uf', corretor.uf);
        sessionStorage.setItem('banco', corretor.codBanco);
        sessionStorage.setItem('agencia', corretor.codAgencia);
        sessionStorage.setItem('dvAgencia', corretor.dvAgencia);
        sessionStorage.setItem('conta', corretor.conta);
        sessionStorage.setItem('dvConta', corretor.dvConta);
        sessionStorage.setItem('camara', corretor.codCamara);
    }*/

    consultaDados() {

        this.spinnerService.show();

        // TODO: O banco deve ser salvo no formato original, e não em inteiro
        // Funciona: codBanco = '001' | Não funciona: codBanco = 1
        if (sessionStorage.getItem('simplesNacional') == 'null') {
            sessionStorage.setItem('simplesNacional', 'false');
        }


        this.contactForm.setValue({
            susep: sessionStorage.getItem('codigoSusep'),
            nome: sessionStorage.getItem('nomecorretor'),
            cpfcnpj: sessionStorage.getItem('cnpjCpf'),
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

        this.mapForm();

        this.spinnerService.hide();
    }

    pageChanged(page: any) {
        this.pagination.currentPage = page;
        this.sucAtivas();
    }

    mapForm() {

        const data = this.contactForm.getRawValue();

        this.salvar.susep = data.susep;
        this.salvar.nome = data.nome;
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
