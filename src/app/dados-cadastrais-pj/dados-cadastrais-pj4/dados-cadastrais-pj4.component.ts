import { Component, OnInit } from '@angular/core';
import { SalvarDadosService } from 'src/app/services/salvar-dados.service';
import { ConsultaDadosService } from 'src/app/services/consulta-dados.service';
import { Router } from '@angular/router';

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
        private router: Router) {
    }

    codOrigem: string;

    ngOnInit() {
        const cpfcnpj = sessionStorage.getItem('cnpjCpf');
        const susep = sessionStorage.getItem('codigoSusep');
        const nome = sessionStorage.getItem('nomecorretor');
        this.codOrigem = sessionStorage.getItem("codOrigem");

        loadUploader(301, susep, cpfcnpj, nome);
    }

    onSubmit() {
        if (checkDocuments()) {
            alert('Todos os arquivos são obrigatórios. Favor Verificar.');
            return;
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
}
