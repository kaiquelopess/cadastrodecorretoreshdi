import { Component, OnInit } from '@angular/core';
import { AcompanhamentoService } from 'src/app/services/acompanhamento.service';
import { TokenService } from 'src/app/services/token.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-acompanhamento-validacao2',
  templateUrl: './acompanhamento-validacao2.component.html',
  styleUrls: ['./acompanhamento-validacao2.component.css']
})
export class AcompanhamentoValidacao2Component implements OnInit {

  constructor(
    private tokenService: TokenService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private acompanhamentoService: AcompanhamentoService,
    private http: HttpClient
  ) { }

  salvar: any = {
    susep: '00000100370029',
    cnpjCpf: '03042618000102'
  }

  passoAprovacao: any = [];
  aprovador: any = [];
  historico: any = [];

  ngOnInit() {
    this.acompanhamento2(this.salvar);
  }


  acompanhamento2(salvar: any) {

    this.tokenService.getToken().subscribe(
      data =>
        // sessionStorage.setItem('token', data.access_token),


      this.acompanhamentoService.historicoAcompanhamento(this.salvar).subscribe(
        response => {

          let results = response.response.dsHistoricoProdutor.dsHistoricoProdutor;


          this.historico = results.ttHistorico;
          this.aprovador = results.ttAprovadorAtual;
          this.passoAprovacao = results.ttPassoAprovacao;

        })
    )
  }


}
