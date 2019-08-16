import { Component, OnInit } from '@angular/core';
import { EsquecisenhaService } from 'src/app/services/esquecisenha.service';
import { TokenService } from 'src/app/services/token.service';
import { FormBuilder, Validators } from '@angular/forms';
import {ValidadorDocumentoService} from '../services/utils/validador-documento.service';
import {GenericValidator} from '../services/utils/generic-validator-service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-esqueceu-senha',
    templateUrl: './esqueceu-senha.component.html',
    styleUrls: ['./esqueceu-senha.component.css']
})

export class EsqueceuSenhaComponent implements OnInit {

    forgotPasswordModel = {
        tipoProdutor: '',
        codProdutor: '',
        origem: '',
        ipUsuario: ''
    }

    codOrigem: string;

    forgotPasswordForm = this.formBuilder.group({
        cpf: ['', [
            Validators.required,
            Validators.minLength(11),
            Validators.maxLength(11),
            GenericValidator.isValidCpf()
        ]],
        email: ['', [
            Validators.email,
            Validators.required
        ]]
    });

    constructor(
        private tokenService: TokenService,
        private esquecisenhaService: EsquecisenhaService,
        private formBuilder: FormBuilder,
        private router: Router,
        private validadorDocumentoService: ValidadorDocumentoService) { }

    ngOnInit() {
        this.codOrigem = sessionStorage.getItem("codOrigem");
     }

    onSubmit() {

        this.tokenService.getToken()
            .subscribe(
                (data: any) => {
                    sessionStorage.setItem('token', data.access_token);

                    // TODO: Criar método para mapear o formulário no modelo
                    this.forgotPasswordModel.codProdutor = this.forgotPasswordForm.value.cpf;

                    this.esquecisenhaService.EsqueciSenha(this.forgotPasswordModel)
                        .subscribe(
                            (response: any) => {
                                let results = response.DadosSaida.Mensagem[0];

                                // this.EsqueceuSenha = results;

                                if (results.Codigo === '')
                                    alert('Digite o CPF');

                                if (results.Codigo === '001')
                                    return alert(results.Descricao);

                                else {
                                    alert(results.Descricao);
                                    sessionStorage.setItem('codProdutor', this.forgotPasswordModel.codProdutor);
                                }
                            },
                            (error: any) => {
                                alert(error.statusText);
                            });
                },
                (error: any) => {
                    sessionStorage.clear();
                    alert(error);
                });

                this.finalizarSenha();
    }

    finalizarSenha(){
            this.router.navigate(['app-ja-sou-cadastrado/' + this.codOrigem], {queryParamsHandling: 'preserve'});
        }
}
