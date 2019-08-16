import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {SalvarDadosService} from 'src/app/services/salvar-dados.service';
import {TokenService} from 'src/app/services/token.service';
import {FormBuilder, Validators} from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner';
import {ValidadorDocumentoService} from '../services/utils/validador-documento.service';

@Component({
    selector: 'app-primeiro-acesso',
    templateUrl: './primeiro-acesso.component.html',
    styleUrls: ['./primeiro-acesso.component.css']
})
export class PrimeiroAcessoComponent implements OnInit {

    constructor(
        private router: Router,
        private validadorDocumentoService: ValidadorDocumentoService,
        private salvarDadosService: SalvarDadosService,
        private tokenService: TokenService,
        private activatedRoute: ActivatedRoute,
        private formBuilder: FormBuilder,
        private spinnerService: NgxSpinnerService) {
    }

    origem: number;

    itsCpf = false;

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
        simplesNacional: '',
        dvConta: '',
        dvAgencia: '',
        ciencia: false,
        emailUsuario: '',
        senha: ''
    };

    submitted = false;

    registerForm = this.formBuilder.group({
        nome: ['', Validators.required],
        cpf: ['', [
            Validators.required,
            Validators.minLength(11),
            Validators.maxLength(11)
        ]],
        emailUsuario: ['', [
            Validators.email,
            Validators.required
        ]],
        senha: ['', [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(30)
        ]],
        confirmarSenha: ['', [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(30)
        ]]
    });

    ngOnInit() {
        this.origem = Number(this.activatedRoute.snapshot.paramMap.get('origem'));
    }

    get f() { return this.registerForm.controls; }

    onSubmit() {

        this.submitted = true;

        if (!this.confirmPassword()) {
            alert('As senhas informadas devem ser iguais.');
            return;
        }

        if (!this.verificaCnpjCpf(this.registerForm.value.cpf.trim())) {
            alert('CNPJ/CPF inválido!');
            return;
        }

        this.spinnerService.show();

        this.tokenService.getToken()
            .subscribe(
                (data: any) => {
                    sessionStorage.setItem('token', data.access_token);

                    this.salvar.cpfContato = this.registerForm.value.cpf;
                    this.salvar.nomeContato = this.registerForm.value.nome;
                    this.salvar.emailUsuario = this.registerForm.value.emailUsuario;
                    this.salvar.senha = this.registerForm.value.senha;
                    this.salvar.TipoContato = true;

                    sessionStorage.setItem('nome_usuario', this.salvar.nomeContato);
                    sessionStorage.setItem('email_usuario', this.salvar.emailUsuario);
                    sessionStorage.setItem('cpf_usuario', this.salvar.cpfContato);
                    sessionStorage.setItem('senha_usuario', this.salvar.senha);
                    sessionStorage.setItem('simplesNacional', 'false');

                    this.salvar.numseq = sessionStorage.getItem('numseq');
                    this.salvar.susep = sessionStorage.getItem('codigoSusep');
                    this.salvar.cpfcnpj = sessionStorage.getItem('cnpjCpf');
                    this.salvar.cod_empresa = sessionStorage.getItem('cod_empresa');
                    this.salvar.simplesNacional = sessionStorage.getItem('simplesNacional');
                    this.salvar.situacao = '1';
                    this.salvar.endereco = sessionStorage.getItem('endereco');
                    this.salvar.numero = sessionStorage.getItem('numero');
                    this.salvar.complemento = sessionStorage.getItem('complemento');
                    this.salvar.bairro = sessionStorage.getItem('bairro');
                    this.salvar.cidade = sessionStorage.getItem('cidade');
                    this.salvar.uf = sessionStorage.getItem('uf');
                    this.salvar.cep = sessionStorage.getItem('cep');

                    if (this.salvar.cpfcnpj.length == 11) {
                        this.itsCpf = true;
                    } else {
                        this.itsCpf = false;
                    }

                    this.salvarDadosService.salvarContatos(this.salvar)
                        .subscribe(
                            (response: any) => {
                                const results = response.response.dsDadosProdutor.dsDadosProdutor;

                                if (results.ttblmensagem[0].Codigo.toString() === '002') {
                                    alert(results.ttblmensagem[0].Descricao.toString());
                                    this.router.navigate(['/login/' + this.origem]);
                                } else {
                                    this.salvarDadosService
                                        .updateSessionStorage(response.response.dsDadosProdutor.dsDadosProdutor.ttDadosProdutor[0]);

                                    const route = (this.itsCpf ? '/app-meus-dados/' : '/app-meus-dados-pj/') + this.origem;
                                    this.router.navigate([route], {queryParamsHandling: 'preserve'});
                                }

                                this.spinnerService.hide();
                            },
                            (error: any) => {
                                this.spinnerService.hide();
                                alert(error.statusText);
                            }
                        );
                });
    }

    verificaCnpjCpf(cnpjCpf: string): boolean {

        let result = false;

        if (cnpjCpf.length === 11) {
            if (this.validadorDocumentoService.validaCpf(cnpjCpf)) {
                result = true;
            }
        } else if (cnpjCpf.length === 14) {
            result = this.validadorDocumentoService.validaCnpj(cnpjCpf);
        }


        return result;
    }

    confirmPassword() {
        const password = this.registerForm.value.senha;
        const confirmation = this.registerForm.value.confirmarSenha;

        return password === confirmation;
    }

    validarCaracter(event:KeyboardEvent){

        return /[\wÀ-ú- ]/.test(event.key);
    }
}
