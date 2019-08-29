import {Component, OnInit} from '@angular/core';
import { SalvarDadosService } from 'src/app/services/salvar-dados.service';
import { ConsultaDadosService } from 'src/app/services/consulta-dados.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';

declare function loadUploader(perfil: number, susep: string, documento: string, razao: string): any;
declare function checkDocuments(): any;
declare function sendDocuments(): any;


@Component({
    selector: 'app-dados-cadastrais-pf4',
    templateUrl: './dados-cadastrais-pf4.component.html',
    styleUrls: ['./dados-cadastrais-pf4.component.css']
})
export class DadosCadastraisPf4Component implements OnInit {

    constructor(
        private salvarDadosService: SalvarDadosService,
        private router: Router,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute
        ) {
    }

    
    codOrigem: string;

    salvar: any = {
        susep: '',
        cpfcnpj: '',
        nome: '',
        razaoSocial: '',
        codigoProdutor: '',
        filial: '',
        ciencia: false
    };

    contactForm = this.formBuilder.group({
        ciencia: [false]
});

    ngOnInit() {
        const cpfcnpj = sessionStorage.getItem('cnpjCpf');
        const susep = sessionStorage.getItem('codigoSusep');
        const nome = sessionStorage.getItem('nomecorretor');
        this.codOrigem = sessionStorage.getItem("codOrigem");

        loadUploader(302, susep, cpfcnpj, nome);

        this.contactForm.setValue({
            ciencia: false
        });
    }

    onSubmit() {
        if (checkDocuments()) {
            alert('É necessário enviar todos os arquivos obrigatórios.');
            return;

        }

        if (!this.contactForm.value.ciencia) {
            alert('Para dar continuidade, favor assinalar a ciência das informações');
            return false;
        }

        sendDocuments();

        const salvar = this.salvarDadosService.getSalvar();

        // Mudar status do cliente para que seja aprovado
        salvar.situacao = '2';

        this.salvarDadosService.salvarDados(salvar)
            .subscribe(
                (data: any) => alert(data.response.dsDadosProdutor.dsDadosProdutor.ttblmensagem[0].Descricao),
                (error: any) => console.log(error.statusText)
            );

            this.finalizar();
        }

    finalizar(){
        this.router.navigate(['app-ja-sou-cadastrado/' + this.codOrigem], {queryParamsHandling: 'preserve'});
    }

    voltar(idTab: any) {
        this.router.navigate(['../dados-cadastrais-pf2'], { relativeTo: this.route });
        /* $('.nav-tabs a[href="#' + idTab + '"]').tab('show'); */
    }
}



