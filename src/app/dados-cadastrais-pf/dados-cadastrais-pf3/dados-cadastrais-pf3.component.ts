import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dados-cadastrais-pf3',
  templateUrl: './dados-cadastrais-pf3.component.html',
  styleUrls: ['./dados-cadastrais-pf3.component.css']
})
export class DadosCadastraisPf3Component implements OnInit {

  constructor() { }

  ngOnInit() {
  }


  salvarDados(idTab: any) {
    
    $('.nav-tabs a[href="#'+idTab+'"]').tab("show");

}


}
