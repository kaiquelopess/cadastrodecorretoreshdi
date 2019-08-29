import {Component, OnInit} from '@angular/core';

import {NgxSpinnerService} from 'ngx-spinner';

// Services
import {CargoService} from 'src/app/services/cargo.service';
import {SalvarDadosService} from 'src/app/services/salvar-dados.service';
import {ConsultaDadosService} from 'src/app/services/consulta-dados.service';
import {CepService} from 'src/app/services/cep.service';
import {FormBuilder, Validators} from '@angular/forms';
import {ValidadorDocumentoService} from 'src/app/services/utils/validador-documento.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-dados-cadastrais-pj2',
    templateUrl: './dados-cadastrais-pj2.component.html',
    styleUrls: ['./dados-cadastrais-pj2.component.css']
})
export class DadosCadastraisPj2Component implements OnInit {

    cargos: any;
    consultar: any[];
    maxDate = new Date().toJSON().split('T')[0];

    salvar: any = {
        telefoneComercial: '',
        telefoneCelular: '',
        emailSin: '',
        emailExt: '',
        emailRenova: '',
        cargo: '',
        cpf: '',
        nome: '',
        dtNasc: '',
        telComercial: '',
        telCelular: '',
        SbgrId: '',
        emailUsuario: '',
        emailNotaFiscal: ''
    };

    corretoresContatos: Array<any> =
        [{
            cargo: '',
            cpf: '',
            nome: '',
            dtNasc: '',
            telComercial: '',
            telCelular: '',
            emailCadastro: '',
            emailUsuario: ''
        }];

    // Forms
    contactForm = this.formBuilder.group({
        emailRenova: ['', [
            Validators.email,
            Validators.required
        ]],
        emailNotaFiscal: ['', [
            Validators.email,
            Validators.required
        ]],
        emailSin: ['', [
            Validators.email,
            Validators.required
        ]],
        emailExt: ['', [
            Validators.email,
            Validators.required
        ]],
        endereco: ['', Validators.required],
        numero: ['', Validators.required],
        complemento: [''],
        bairro: ['', Validators.required],
        municipio: ['', Validators.required],
        uf: ['', Validators.required],
        telefoneComercial: ['', [
            Validators.required,
            Validators.minLength(10)
        ]],
        telefoneCelular: ['', [
            Validators.required,
            Validators.minLength(10)
        ]],
        cep: ['', Validators.required]
    });

    corretoraForm = this.formBuilder.group({
        nome: ['', Validators.required],
        emailUsuario: ['', [
            Validators.email,
            Validators.required
        ]],
        cpf: ['', [
            Validators.required,
            Validators.minLength(11),
            Validators.maxLength(11)
        ]],
        dtNasc: ['', Validators.required],
        telComercial: ['', [
            Validators.required,
            Validators.minLength(10)
        ]],
        telCelular: ['', [
            Validators.required,
            Validators.minLength(10)
        ]],
        cargo: ['Escolha um cargo', Validators.required]
    });

    constructor(
        private cargoService: CargoService,
        private salvarDadosService: SalvarDadosService,
        private consultaDadosService: ConsultaDadosService,
        private spinnerService: NgxSpinnerService,
        private formBuilder: FormBuilder,
        private cepService: CepService,
        private validadorDocumentoService: ValidadorDocumentoService,
        private router: Router,
        private route: ActivatedRoute ) {
        this.listaCargos();
    }

    ngOnInit() {
        this.obterDados();
        this.consultaDados();
    }

    onSubmit(idTab: any) {

        // if (!this.contactForm.value.confirm) {
        //     alert('Para dar continuidade, favor assinalar a ciência das informações');
        //     return false;
        // }

        const errors = this.validateErrors();

        if (errors.length > 0) {
            alert('Preencha todos os dados obrigatórios corretamente para continuar:\n\n' + errors);
            return false;
        }

        this.spinnerService.show();

        this.mapForm();

        this.salvar.numseq = sessionStorage.getItem('numseq');
        this.salvar.susep = sessionStorage.getItem('codigoSusep');
        this.salvar.cpfcnpj = sessionStorage.getItem('cnpjCpf');

        this.salvarDadosService.salvarDados(this.salvar)
            .subscribe(
                (data: any) => {

                    const message = data.response.dsDadosProdutor.dsDadosProdutor.ttblmensagem[0];

                    if (message.Codigo === '002') {
                        this.spinnerService.hide();
                        alert(message.Descricao);
                    } else {
                        this.salvarDadosService.updateSessionStorage(data.response.dsDadosProdutor.dsDadosProdutor.ttDadosProdutor[0]);
                        
                        this.router.navigate(['../dados-cadastrais-pj4'], { relativeTo: this.route });

                        // $('.nav-tabs a[href="#' + idTab + '"]').tab('show');
                        this.spinnerService.hide();
                    }
                },
                (error: any) => {
                    this.spinnerService.hide();
                    alert(error.statusText);
                }
            );
    }

    consultaDados() {
        this.consultaDadosService.consultaDados()
            .subscribe(
                (response: any) => {
                    let consultar = response.response.dsDadosProdutor.dsDadosProdutor.ttDadosProdutor[0];
                    this.getContatos(response.response.dsDadosProdutor.dsDadosProdutor.ttUsuario);

                    sessionStorage.setItem('email', consultar.email);
                    sessionStorage.setItem('emailNotaFiscal', consultar.emailNf);
                    sessionStorage.setItem('emailSin', consultar.emailSin);
                    sessionStorage.setItem('emailExt', consultar.emailExt);

                    this.consultar = consultar;
                },
                (error: any) => {
                    alert(error.statusText);
                }
            );
    }

    voltar(idTab: any) {
        this.router.navigate(['../dados-cadastrais-pj'], { relativeTo: this.route });
        // $('.nav-tabs a[href="#' + idTab + '"]').tab('show');
    }

    listaCargos() {

        this.cargoService.getCargos().subscribe(
            (response: any) => this.cargos = response.dsIsWbSbgr.ttIsWbSbgr,
            (error: any) => alert(error.statusText));
    }

    getContatos(contatos) {

        this.corretoresContatos = [];

        if (contatos) {
            contatos.forEach(contact => {
                    let ct: any = {};

                    ct.cpfContato = contact.cpf;
                    ct.nomeContato = contact.nome;
                    ct.emailUsuario = contact.email;
                    ct.dtNascContato = contact.dtNasc;
                    ct.telComercialContato = contact.telComercial;
                    ct.telCelularContato = contact.telCelular;
                    ct.SbgrId = contact.codCargo;
                    if (this.cargos) {
                        const cargo = this.cargos[parseInt(ct.SbgrId) - 1];
                        ct.cargoContato = cargo.SbgrDs;
                    }

                    if (!contact.userPrincipal) {
                        this.corretoresContatos.push(ct);
                    }
                }
            );
        }
    }

    cadastraContato() {

        const errors = this.validateCorretoraErrors();

        if (errors.length > 0) {
            alert('Preencha todos os dados obrigatórios corretamente para continuar:\n\n' + errors);
        } else {

            const data = this.corretoraForm.getRawValue();

            this.salvar.cpfContato = data.cpf;
            this.salvar.nomeContato = data.nome;
            this.salvar.emailUsuario = data.emailUsuario;
            this.salvar.dtNascContato = this.corretoraForm.controls.dtNasc.value;
            this.salvar.telComercialContato = data.telComercial;
            this.salvar.telCelularContato = data.telCelular;
            this.salvar.SbgrId = data.cargo;
            this.salvar.TipoUser = false;

            this.spinnerService.show();
            this.mapForm();
            this.salvarDadosService.salvarContatos(this.salvar)
                .subscribe(
                    (response: any) => {
                        let salvar = response.response.dsDadosProdutor.dsDadosProdutor;

                        if (salvar.ttblmensagem && salvar.ttblmensagem[0].Codigo === '002') {
                            alert(salvar.ttblmensagem[0].Descricao);
                            this.spinnerService.hide();
                            return;
                        }

                        /**
                         * O cadasto que retorna da HDI não trás o cargo.
                         * Então é necessário pegar o que foi salvo e colocar no array para
                         * que você tenha a informação.
                         */

                        salvar.ttUsuario[0]['cargo'] = this.salvar.cargo;

                        // this.corretoresContatos.push(salvar.ttUsuario[0]);

                        this.consultaDados();
                        this.corretoraForm.reset();
                        this.spinnerService.hide();
                    },
                    (error: any) => {
                        this.spinnerService.hide();
                        alert(error);
                    });
        }
    }

    obterDados() {
        this.salvar.endereco = sessionStorage.getItem('endereco');
        this.salvar.numero = sessionStorage.getItem('numero');
        this.salvar.complemento = sessionStorage.getItem('complemento');
        this.salvar.cep = sessionStorage.getItem('cep');
        this.salvar.bairro = sessionStorage.getItem('bairro');
        this.salvar.cidade = sessionStorage.getItem('cidade');
        this.salvar.uf = sessionStorage.getItem('uf');
        this.salvar.emailExt = sessionStorage.getItem('emailExt');
        this.salvar.emailNotaFiscal = sessionStorage.getItem('emailNotaFiscal');
        this.salvar.emailSin = sessionStorage.getItem('emailSin');
        this.salvar.emailRenova = sessionStorage.getItem('email');
        this.salvar.telefoneComercial = sessionStorage.getItem('telComercial');
        this.salvar.telefoneCelular = sessionStorage.getItem('telCelular');

        //this.corretoraForm.controls.emailRenova.setValue(this.salvar.emailRenova);

        this.contactForm.setValue({
            emailRenova: sessionStorage.getItem('email'),
            emailSin: sessionStorage.getItem('emailSin'),
            emailNotaFiscal: sessionStorage.getItem('emailNotaFiscal'),
            emailExt: sessionStorage.getItem('emailExt'),
            cep: sessionStorage.getItem('cep'),
            endereco: sessionStorage.getItem('endereco'),
            numero: sessionStorage.getItem('numero'),
            complemento: sessionStorage.getItem('complemento'),
            bairro: sessionStorage.getItem('bairro'),
            municipio: sessionStorage.getItem('cidade'),
            uf: sessionStorage.getItem('uf'),
            telefoneComercial: sessionStorage.getItem('telComercial'),
            telefoneCelular: sessionStorage.getItem('telCelular'),
        });
    }

    mapForm() {
        this.salvar.nome = this.corretoraForm.value.nome;
        this.salvar.emailUsuario = this.corretoraForm.value.emailUsuario;
        this.salvar.cpf = this.corretoraForm.value.cpf;
        this.salvar.dtNasc = this.corretoraForm.value.dtNasc;
        this.salvar.telComercial = this.corretoraForm.value.telComercial;
        this.salvar.telCelular = this.corretoraForm.value.telCelular;
        this.salvar.emailRenova = this.contactForm.value.emailRenova;
        this.salvar.emailNotaFiscal = this.contactForm.value.emailNotaFiscal;
        this.salvar.emailSin = this.contactForm.value.emailSin;
        this.salvar.emailExt = this.contactForm.value.emailExt;
        this.salvar.endereco = this.contactForm.value.endereco;
        this.salvar.numero = this.contactForm.value.numero;
        this.salvar.complemento = this.contactForm.value.complemento;
        this.salvar.bairro = this.contactForm.value.bairro;
        this.salvar.cidade = this.contactForm.value.municipio;
        this.salvar.uf = this.contactForm.value.uf;
        this.salvar.telefoneComercial = this.contactForm.value.telefoneComercial;
        this.salvar.telefoneCelular = this.contactForm.value.telefoneCelular;
        this.salvar.cargo = this.corretoraForm.value.cargo;
        this.salvar.cep = this.contactForm.value.cep;
    }

    validateErrors() {

        let errors = '';

        if (this.contactForm.controls.emailRenova.errors) {
            if (this.contactForm.controls.emailRenova.errors.required) {
                errors += 'O campo Contato RE está vazio\n';
            }
            if (this.contactForm.controls.emailRenova.errors.email) {
                errors += 'O campo email informado para Contanto RE é inválido\n';
            }
        }

        if (this.contactForm.controls.emailNotaFiscal.errors) {
            if (this.contactForm.controls.emailNotaFiscal.errors.required) {
                errors += 'O campo Contato Nota Fiscal está vazio\n';
            }
            if (this.contactForm.controls.emailNotaFiscal.errors.email) {
                errors += 'O campo email informado para Contanto Nota Fiscal é inválido\n';
            }
        }

        if (this.contactForm.controls.emailSin.errors) {
            if (this.contactForm.controls.emailSin.errors.required) {
                errors += 'O campo Contato Sinistro está vazio\n';
            }
            if (this.contactForm.controls.emailSin.errors.email) {
                errors += 'O campo email informado para Contanto Sinistro é inválido\n';
            }
        }

        if (this.contactForm.controls.emailExt.errors) {
            if (this.contactForm.controls.emailExt.errors.required) {
                errors += 'O campo Contato Extrato está vazio\n';
            }
            if (this.contactForm.controls.emailExt.errors.email) {
                errors += 'O campo email informado para Contanto Extrato é inválido\n';
            }
        }

        if (this.contactForm.controls.cep.errors) {
            errors += 'O campo CEP está vazio\n';
        }

        if (this.contactForm.controls.endereco.errors) {
            errors += 'O campo Endereço está vazio\n';
        }

        if (this.contactForm.controls.numero.errors) {
            errors += 'O campo Número está vazio\n';
        }

        if (this.contactForm.controls.bairro.errors) {
            errors += 'O campo Bairro está vazio\n';
        }

        if (this.contactForm.controls.municipio.errors) {
            errors += 'O campo Município está vazio\n';
        }

        if (this.contactForm.controls.uf.errors) {
            errors += 'O campo Estado está vazio\n';
        }


        if (this.contactForm.controls.telefoneComercial.value === '0000000000'){
            errors += 'O telefone não existe.\n';
        }

        
        if (this.contactForm.controls.telefoneComercial.errors) {
            if (this.contactForm.controls.telefoneComercial.errors.required) {
                errors += 'O campo Telefone Comercial está vazio\n';
            }

            if (this.contactForm.controls.telefoneComercial.errors.minLength) {
                errors += 'Informe um Telefone Comercial válido\n';
            }
        }

        if (this.contactForm.controls.telefoneCelular.value === '00000000000'){
            errors += 'O telefone não existe.\n';
        }

        if (this.contactForm.controls.telefoneCelular.errors) {
            if (this.contactForm.controls.telefoneCelular.errors.required) {
                errors += 'O campo Telefone Celular está vazio\n';
            }

            if (this.contactForm.controls.telefoneCelular.errors.minLength) {
                errors += 'Informe um Telefone Celular válido\n';
            }
        }

        return errors;
    }

    validateCorretoraErrors() {

        let errors = '';

        if (this.corretoraForm.controls.nome.errors) {
            errors += 'O campo Nome está vazio\n';
        }

        if (this.corretoraForm.controls.emailUsuario.value === '' ) {
            errors += 'O campo Email está vazio\n';
        } else 

        if (this.corretoraForm.controls.emailUsuario.errors){
            errors += 'Informe um Email Válido';
        }

        if (this.corretoraForm.controls.cpf.errors || !this.validadorDocumentoService.validaCpf(this.corretoraForm.value.cpf.trim())) {
            errors += 'Informe um CPF válido\n';
        }

        if (this.corretoraForm.controls.dtNasc.errors) {
            errors += 'Informe uma data de nascimento válida\n';
        }

        if (this.corretoraForm.controls.telComercial.value === '0000000000'){
            errors += 'O telefone não existe.\n';
        }

        if (this.corretoraForm.controls.telComercial.errors) {
            errors += 'Informe um telefone comercial válido\n';
        }

        if (this.corretoraForm.controls.telCelular.value === '00000000000'){
            errors += 'O telefone não existe.\n';
        }

        if (this.corretoraForm.controls.telCelular.errors) {
            errors += 'Informe um telefone celular válido\n';
        }

        if (this.corretoraForm.controls.dtNasc.errors) {
            if (this.corretoraForm.controls.dtNasc.errors.required) {
                errors += 'Informe a data de nascimento\n';
            }
        } else {
            // tslint:disable-next-line:max-line-length
            const dt = this.corretoraForm.controls.dtNasc.value.toString();
            const novadata = dt.substr(0, 2) + '/' + dt.substr(2, 2) + '/' + dt.substr(4, 4);

            // tslint:disable-next-line:max-line-length
            const ptDatePattern = /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/g;


            if (!novadata.match(ptDatePattern)) {
                errors += 'Informe uma data de nascimento válida\n';
            }
        }

        if (this.corretoraForm.value.cargo.erros || this.corretoraForm.value.cargo === 'Escolha um cargo') {
            errors += 'Informe um cargo\n';
        }

        return errors;
    }

    getCep() {

        if (this.contactForm.value.cep.length < 8) {
            alert('Por favor, informe um CEP válido.');
            return false;
        }

        this.spinnerService.show();

        let results: any;

        // this.salvar.endereco = '';
        // this.salvar.bairro = '';
        // this.salvar.municipio = '';
        // this.salvar.uf = '';

        this.cepService.getCep(this.contactForm.value.cep)
            .subscribe(
                (response: any) => {
                    if (response.status == 'OK') {
                        results = response.results[0];

                        this.contactForm.patchValue({
                            endereco: '',
                            bairro: '',
                            municipio: '',
                            uf: ''
                        });

                        switch (results.address_components.length) {
                            case 6:
                                this.contactForm.patchValue({
                                    endereco: results.address_components[1].long_name,
                                    bairro: results.address_components[2].long_name,
                                    municipio: results.address_components[3].short_name,
                                    uf: results.address_components[4].short_name
                                });
                                break;
                            case 5:
                                this.contactForm.patchValue({
                                    endereco: results.address_components[1].long_name,
                                    bairro: results.address_components[2].long_name,
                                    municipio: results.address_components[2].short_name,
                                    uf: results.address_components[3].short_name
                                });
                                break;
                            case 4:
                                this.contactForm.patchValue({
                                    municipio: results.address_components[3].short_name,
                                    uf: results.address_components[4].short_name
                                });
                                break;
                            case 3:
                                this.contactForm.patchValue({
                                    municipio: results.address_components[3].short_name
                                });
                                break;
                        }

                        this.spinnerService.hide();

                    } else {
                        this.spinnerService.hide();
                        alert('CEP não encontrado. Por favor verifique e tente novamente.');
                    }
                },
                (error: any) => {
                    this.spinnerService.hide();
                    alert(error.statusText);
                }
            );
    }

    validarCaracter(event:KeyboardEvent){

        return /^[a-zA-Z0-9]+/g.test(event.key);
    }
}
