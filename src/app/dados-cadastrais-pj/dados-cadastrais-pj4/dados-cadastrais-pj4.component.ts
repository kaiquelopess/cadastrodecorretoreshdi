import { Component, OnInit } from '@angular/core';
import { SalvarDadosService } from 'src/app/services/salvar-dados.service';
import { ConsultaDadosService } from 'src/app/services/consulta-dados.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';

declare function loadUploader(perfil: number, susep: string, documento: string, razao: string): any;
declare function checkDocuments(): any;
declare function sendDocuments(): any;

@Component({
    selector: 'app-dados-cadastrais-pj4',
    templateUrl: './dados-cadastrais-pj4.component.html',
    styleUrls: ['./dados-cadastrais-pj4.component.css']
})

export class DadosCadastraisPj4Component implements OnInit {

    constructor(
        private salvarDadosService: SalvarDadosService,
        private router: Router,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute) {
    }

    codOrigem: string;

    contactForm = this.formBuilder.group({
        ciencia: [false]
});

    ngOnInit() {
        const cpfcnpj = sessionStorage.getItem('cnpjCpf');
        const susep = sessionStorage.getItem('codigoSusep');
        const nome = sessionStorage.getItem('nomecorretor');
        this.codOrigem = sessionStorage.getItem("codOrigem");

        loadUploader(301, susep, cpfcnpj, nome);

        this.contactForm.setValue({
            ciencia: false
        });
    }

    onSubmit() {
        if (checkDocuments()) {
            alert('Todos os arquivos são obrigatórios. Favor Verificar.');
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
        this.router.navigate(['../dados-cadastrais-pj2'], { relativeTo: this.route });
        /* $('.nav-tabs a[href="#' + idTab + '"]').tab('show'); */
    }
}
