import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
    username = '';
    cpfcnpj = '';
    susep = '';
    perfil = 302;

    constructor() {

    }

    ngOnInit() {
        if (sessionStorage.getItem('cnpjCpf').length > 11){
            this.perfil = 301;
        }
        else{
            this.perfil = 302;
        }
        this.username = sessionStorage.getItem('codigoSusep') + '_' + sessionStorage.getItem('cnpjCpf');
        this.cpfcnpj = sessionStorage.getItem('nomecorretor');
        this.susep = sessionStorage.getItem('codigoSusep');
    }

}
