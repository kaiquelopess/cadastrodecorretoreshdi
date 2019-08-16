import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';

// Services
import { TokenService } from '../services/token.service';
import { ValidaLoginSenhaService } from '../services/valida-login-senha.service';
import { ConsultaOrigemService } from '../services/consulta-origem.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ConsultaDadosService } from 'src/app/services/consulta-dados.service';
import { ValidadorDocumentoService } from 'src/app/services/utils/validador-documento.service';
import {SalvarDadosService} from '../services/salvar-dados.service';

@Component({
    selector: 'app-ja-sou-cadastrado',
    templateUrl: './ja-sou-cadastrado.component.html',
    styleUrls: ['./ja-sou-cadastrado.component.css']
})

export class JaSouCadastradoComponent implements OnInit {
    codOrigem = '';

    itsCpf = false;
    origem: string;

    loginModel: any = {
        login: '',
        senha: ''
    };

    loginForm = this.formBuilder.group({
        cpf: ['', [
            Validators.required,
            Validators.minLength(11),
            Validators.maxLength(11)
        ]],
        password: ['', Validators.required]
    });

    constructor(
        private tokenService: TokenService,
        private spinnerService: NgxSpinnerService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private validaLoginSenhaService: ValidaLoginSenhaService,
        private consultaDadosService: ConsultaDadosService,
        private consultaOrigemService: ConsultaOrigemService,
        private salvarDadosService: SalvarDadosService,
        private formBuilder: FormBuilder,
        private validadorDocumentoService: ValidadorDocumentoService) { }

    ngOnInit() {
        sessionStorage.clear();
        this.codOrigem = sessionStorage.getItem('nom_empresa');

        this.tokenService.getToken()
            .subscribe(
                (data: any) => {
                    sessionStorage.setItem('token', data.access_token);

                    if (!this.codOrigem) {
                        this.codOrigem = this.activatedRoute.snapshot.queryParamMap.get('codorigem').toString();

                        sessionStorage.setItem('codOrigem', this.codOrigem);
                        this.consultaOrigem();
                    }

                });
    }

    onSubmit() {

        // TODO: Criar método para mapear o formulário no modelo
        this.loginModel.login = this.loginForm.value.cpf;
        this.loginModel.senha = this.loginForm.value.password;

        if (this.loginModel.login.trim() == '')
            return alert('Informe o login para continuar.');

        if (this.loginModel.senha == '')
            return alert('Informe a senha para poder continuar');

        if (!this.validadorDocumentoService.validaCpf(this.loginModel.login.trim()))
            return alert('CNPJ/CPF inválido!');

        this.spinnerService.show();

        this.tokenService.getToken()
            .subscribe(
                (data: any) => {

                    sessionStorage.setItem('token', data.access_token);
                    sessionStorage.setItem('login', this.loginModel.login.trim());
                },
                () => {
                    sessionStorage.clear();
                    alert('Não foi possível efetuar login. Tente novamente mais tarde.');
                    this.spinnerService.hide();
                });

        this.validaLoginSenhaService.validaLoginSenha(this.loginModel)
            .subscribe(
                (data: any) => {
                    let results = data.dsDadosLogin;

                    if (results.Mensagem[0].Codigo === '002') {
                        alert(results.Mensagem[0].Descricao);
                        this.spinnerService.hide();
                        return;
                    }

                    sessionStorage.setItem('login', this.loginModel.login.trim());
                    sessionStorage.setItem('codigoSusep', results.ttUsuario[0].susep);
                    sessionStorage.setItem('cnpjCpf', results.ttUsuario[0].cpf);

                    this.getBrokerData();
                },
                () => {
                    sessionStorage.clear();
                    alert('Não foi possível efetuar login. Tente novamente mais tarde.');
                    this.spinnerService.hide();
                });
    }

    navigateTo() {
        this.spinnerService.hide();

        if (this.itsCpf)
            this.router.navigate(['/app-meus-dados/' + this.origem]);
        else
            this.router.navigate(['/app-meus-dados-pj/' + this.origem]);
    }

    consultaOrigem() {
        this.consultaOrigemService.consultaOrigem(this.codOrigem)
            .subscribe(
                (response: any) => {
                    const codMensagem = response.DadosOrigem.Mensagem[0].Codigo;

                    if (codMensagem === '001') {

                        const consultarOrigem = response.DadosOrigem.ttDadosOrigem[0];

                        sessionStorage.setItem('cod_empresa', consultarOrigem.cod_empresa);
                        sessionStorage.setItem('nom_empresa', consultarOrigem.nom_empresa);
                        sessionStorage.setItem('origem', consultarOrigem.cod_origem);

                        this.origem = consultarOrigem.nom_empresa;
                    } else {
                        if (response.DadosOrigem.Mensagem[0].Descricao !== 'undefined') {
                            alert(response.DadosOrigem.Mensagem[0].Descricao);
                            this.spinnerService.hide();
                            return;
                        }
                    }
                },
                (error: any) => alert(error.statusText));
    }

    getBrokerData() {
        this.itsCpf = false;
        this.consultaDadosService.consultaDados()
            .subscribe(
                (response: any) => {
                    let results = response.response.dsDadosProdutor.dsDadosProdutor;
                    let user = response.response.dsDadosProdutor.dsDadosProdutor;

                    if (results.ttblmensagem[0].Codigo.toString() === '002') {
                        alert(results.ttblmensagem[0].Descricao.toString());
                        this.spinnerService.hide();
                        return;
                    }
                    else {
                        results = results.ttDadosProdutor[0];
                        this.salvarDadosService.updateSessionStorage(results);

                        let users = user.ttUsuario[0];

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
                        sessionStorage.setItem('cidade', results.municipio);
                        sessionStorage.setItem('uf', results.uf);

                        sessionStorage.setItem('telComercial', results.telComercial);
                        sessionStorage.setItem('telCelular', results.telCelular);

                        sessionStorage.setItem('email', results.email);
                        sessionStorage.setItem('emailSin', results.emailSin);
                        sessionStorage.setItem('emailExt', results.emailExt);
                        sessionStorage.setItem('emailNotaFiscal', results.emailNf);

                        sessionStorage.setItem('simplesNacional', (results.simplesNacional?results.simplesNacional:false));

                        this.navigateTo();
                    }
                },
                error => {
                    alert(error.statusText);
                    this.spinnerService.hide();
                });
    }

    irLoginPrimario() {
        this.router.navigate(['app-login-primario/' + this.origem], { queryParamsHandling: 'preserve' });
    }

    irEsqueciSenha() {
        this.router.navigate(['app-esqueceu-senha/' + this.origem], { queryParamsHandling: 'preserve' });
    }

    validarCaracter(event:KeyboardEvent){

        return /[\wÀ-ú/~!@#$%^&*()_+={[};:'"<,->.?/|]/.test(event.key);
    }
}
