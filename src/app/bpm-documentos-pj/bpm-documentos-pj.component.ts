// import { Component, OnInit } from '@angular/core';
// import { ConsultaDadosService } from 'src/app/services/consulta-dados.service';
// import { ActivatedRoute } from '@angular/router';
// import { TokenService } from '../services/token.service';

// declare function    loadUploader(perfil: number, susep: string, documento: string, razao: string): any;

// // declare function checkDocuments(): any;
// // declare function sendDocuments(): any;

// @Component({
//   selector: 'app-bpm-documentos-pj',
//   templateUrl: './bpm-documentos-pj.component.html',
//   styleUrls: ['./bpm-documentos-pj.component.css']
// })
// export class BpmDocumentosPjComponent implements OnInit {

//   constructor(  ) { } 

// susep: string;
// cpfCnpj: string;
// perfil = 301;

// ngOnInit() {

//   const susep = sessionStorage.getItem("susep");
//   const cpfCnpj = sessionStorage.getItem("cpfcnpj");
//   const nome = sessionStorage.getItem("nome");

//   loadUploader(301, susep, cpfCnpj, nome);
// }

// }

import { Component, OnInit } from '@angular/core';

declare function loadUploader(perfil: number, susep: string, documento: string, razao: string): any;
declare function checkDocuments(): any;
declare function sendDocuments(): any;

@Component({
    selector: 'app-bpm-documentos-pj',
    templateUrl: './bpm-documentos-pj.component.html',
    styleUrls: ['./bpm-documentos-pj.component.css']
})

export class BpmDocumentosPjComponent implements OnInit {

    constructor( ) {
    }

    codOrigem = '';

    ngOnInit() {
        const cpfcnpj = sessionStorage.getItem('cpfcnpj');
        const susep = sessionStorage.getItem('susep');
        const nome = sessionStorage.getItem('nome');
        this.codOrigem = sessionStorage.getItem('codOrigem');

        loadUploader(301, susep, cpfcnpj, nome);
    }

    onSubmit() {
        if (checkDocuments()) {
            alert('Todos os arquivos são obrigatórios. Favor Verificar.');
            return;
        }

        sendDocuments();

        }
    
  
}
