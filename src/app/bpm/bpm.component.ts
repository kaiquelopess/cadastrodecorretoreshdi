import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AprovacaoService } from 'src/app/services/aprovacao.service';
import { PepService } from 'src/app/services/pep.service';
import { ConsultaDadosService } from 'src/app/services/consulta-dados.service';
import { TokenService } from 'src/app/services/token.service'
import { SusepCnpjService } from 'src/app/services/susep-cnpj.service'
import { ConsultaOrigemService } from 'src/app/services/origem.service';
import { SucursaisService } from 'src/app/services/sucursais.service'
import { CorretoresService } from '../services/corretores.service';
import { FormControl } from '@angular/forms';
import { Observable, fromEvent } from 'rxjs';
import { map, startWith, filter, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

export interface Corretor {
  nomProdutor: string;
  tpProdutor: string;
}

@Component({
  selector: 'app-bpm',
  templateUrl: './bpm.component.html',
  styleUrls: ['./bpm.component.css']
})

export class BpmComponent implements OnInit {
  @ViewChild('inputText') inputText: ElementRef;

  funcOption: String;
  sucursalSelecionada: any;
  itsCpf = false;


  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private aprovacaoService: AprovacaoService,
    private consultaOrigemService: ConsultaOrigemService,
    private PepService: PepService,
    private tokenService: TokenService,
    private SusepCnpjService: SusepCnpjService,
    private ConsultaDadosService: ConsultaDadosService,
    private sucursaisService: SucursaisService,
    private elRef: ElementRef,
    private corretoresService: CorretoresService,
    private spinner: NgxSpinnerService

  ) {

    this.susep = String(this.activatedRoute.snapshot.paramMap.get('susep'));
    this.cpfCnpj = String(this.activatedRoute.snapshot.paramMap.get('cpfCnpj'));
    this.usuario = String(this.activatedRoute.snapshot.paramMap.get('usuario'));
    this.etapa = Number(this.activatedRoute.snapshot.paramMap.get('etapa'));

    if (this.cpfCnpj.length <= 11) {
      this.itsCpf = true;
    }
    this.rotaBpm();


    this.funcOption = "escolha()";

  }



  origem: number;
  usuario: String;
  sucursaisAtivas: any;
  disabled: string;
  ExecutivoDeContas: any = '';
  nomeLista: '';
  corretoresLista: Array<any> = [];
  listaEtapa: Array<any> = ["Gerente da Filial", "Administrativo", "Planejamento Comercial", "Tributos"];
  selecEtapa: any;

  susep: any;
  etapa: number;
  cpfCnpj: string;
  motivoAcao: any;
  motivoReprova: any;
  motivoVoltar: any;
  novaSucursal: any;
  motivoPendencia: any;
  respostaToken: boolean = false;


  filtro: any;

  salvar: any = {
    susep: '',
    cnpjCpf: '',
    sucursaisAtivas: '',
    corretores: {},
  }

  corretores: any = {
    tpProdutor: '',
    nomProdutor: ''
  }

  acao: any = {
    susep: '',
    cnpjCpf: '',
    tpColigacao: '',
    codColigacao: '',
    acao: '',
    idUsuario: '',
    codNovaSucursal: '',
    motivoAcao: '',


    municipioFiscal: '',
    numInss: '',
    datInInss: '',
    datFimInss: '',
    numInscFiscal: '',
    datMunIssIni: '',
    datMunIssFim: ''
  }

  tipoProdutor: string;
  codigoProdutor: string;

  ngOnInit() {

    this.tokenService.getToken().subscribe(
      data => {
        if (data.access_token) {

          sessionStorage.setItem('token', data.access_token);

          this.sucAtivas();

          this.respostaToken = true;

        }

      });
  }


  ngAfterViewInit() {


    fromEvent(this.inputText.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      , filter(res => res.length > 2)
      , debounceTime(1000)
      , distinctUntilChanged()
    ).subscribe((text: string) => {
      this.corretoresService.corretores(text).subscribe(
        (data: any) => {
          this.corretoresLista = [];
          this.corretoresLista = this.corretoresLista.concat(data.response.ttProdutor.ttProdutor);
        },
        error => {
          this.corretoresLista = [];

          console.log('Ocorreu um erro buscando lista de endereços: ' + error);

        }
      );
    });
  }



  disableInput() {
    if (this.etapa === 1 && this.ExecutivoDeContas != '') {
      return true;
    } else {
      return false;
    }
  }


  aprovarCadastro() {


    this.spinner.show();

    let corretor: any = this.corretoresLista.find(p => p.nomProdutor == this.nomeLista);
    if (corretor) {
      localStorage.setItem("tipoProdutor", corretor.tProdutor);
      localStorage.setItem("codigoProdutor", corretor.codProdutor);
    } else {

      if (this.etapa !== 1) {

        this.tipoProdutor = localStorage.getItem("tipoProdutor")
        this.codigoProdutor = localStorage.getItem("codigoProdutor")

      } else {
        if (corretor === null) {
          alert("Selecione um nome válido.")
        } else {
          if (corretor === undefined) {
            alert("Selecione um executivo de contas");
            this.spinner.hide();
            return
          }
        }
      }
    }

    if (corretor) {
      this.tipoProdutor = corretor.tProdutor;
      this.codigoProdutor = corretor.codProdutor;

      this.acao.tpColigacao = corretor.tProdutor;
      this.acao.codColigacao = corretor.codProdutor;

    } else {
      this.acao.codColigacao = this.codigoProdutor;
      this.acao.tpColigacao = this.tipoProdutor;
    }

    
      this.acao.acao = "1";
      this.acao.susep = this.susep;
      this.acao.cnpjCpf = this.cpfCnpj;
      this.acao.idUsuario = this.usuario;

      this.aprovacaoService.aprovacaoCorretor(this.acao).subscribe(
        (response: any) => {

          this.acao.acao;
          this.acao.susep;
          this.acao.cnpjCpf;
          this.acao.tpColigacao;
          this.acao.codColigacao;
          this.acao.idUsuario;

          let results = response.response.dsDadosSaida.dsDadosSaida.ttblmensagem[0];

          alert(results.Descricao);

          this.spinner.hide();

        }),

        error => {
          this.spinner.hide();
          alert("Erro ao aprovar, tente novamente.");
        }
    }

  reprovaCadastro() {

    this.spinner.show();


    this.acao.acao = "2";
    this.acao.susep = this.susep
    this.acao.cnpjCpf = this.cpfCnpj;
    this.acao.motivoAcao = this.motivoReprova;
    this.acao.idUsuario = this.usuario;

    this.aprovacaoService.aprovacaoCorretor(this.acao).subscribe(
      (response: any) => {

        let results = response.response.dsDadosSaida.dsDadosSaida.ttblmensagem[0];

        alert(results.Descricao);

        this.spinner.hide();


      })

  }

  redirecionarSucursal() {

    this.spinner.show();

    this.acao.acao = "3";
    this.acao.susep = this.susep
    this.acao.cnpjCpf = this.cpfCnpj;
    this.acao.codNovaSucursal = this.sucursalSelecionada.CodSucursal;
    this.acao.idUsuario = this.usuario;


    this.aprovacaoService.aprovacaoCorretor(this.acao).subscribe(
      (response: any) => {

        let results = response.response.dsDadosSaida.dsDadosSaida.ttblmensagem[0];

        alert(results.Descricao);


        this.spinner.hide();

      })

  }

  solicitarPendencia() {

    this.spinner.show();

    this.acao.acao = "4";
    this.acao.susep = this.susep;
    this.acao.cnpjCpf = this.cpfCnpj;
    this.acao.motivoAcao = this.motivoPendencia;
    this.acao.idUsuario = this.usuario;

    this.aprovacaoService.aprovacaoCorretor(this.acao).subscribe(
      (response: any) => {

        let results = response.response.dsDadosSaida.dsDadosSaida.ttblmensagem[0];

        alert(results.Descricao);

        this.spinner.hide();

      })

  }

  voltarEtapa() {

    this.spinner.show();


    this.selecionaEtapa();

    this.acao.susep = this.susep
    this.acao.cnpjCpf = this.cpfCnpj;
    this.acao.motivoAcao = this.motivoVoltar;
    this.acao.idUsuario = this.usuario;

    if (this.selecEtapa === "Gerente da Filial") {
      this.acao.acao = "5";
      this.acao = this.acao;
    } else {
      if (this.selecEtapa === "Administrativo") {
        this.acao.acao = "6";
        this.acao = this.acao
      } else {
        if (this.selecEtapa === "Planejamento Comercial") {
          this.acao.acao = "7";
          this.acao = this.acao
        }
      }
    }

    this.aprovacaoService.aprovacaoCorretor(this.acao).subscribe(
      
      (response: any) => {

        let results = response.response.dsDadosSaida.dsDadosSaida.ttblmensagem[0];

        

        alert(results.Descricao);


        this.spinner.hide();

        //  this.refresh();

      })
  }

  consultaOrigem(origem: number) {

    this.consultaOrigemService.consultaOrigem(origem).subscribe(
      response => {
        let results = response.DadosOrigem.Mensagem[0];
        this.consultaOrigem = results;

        sessionStorage.setItem('origem', origem.toString());


        if (results.Codigo === '002') {
          alert(results.Descricao);
        } else {
          if (results.Codigo === '001') {
            alert(results.Descricao);
            return;
          }
        }

      },

      error => {
        alert(error.statusText);
      }
    )
  }


  execContas(corretores: any) {

    this.corretores.tpProdutor = 'G,T';
    this.corretores.nomProdutor = this.nomeLista;


    if (this.corretores.nomProdutor.length > 2) {
      this.corretoresService.corretores(this.corretores).subscribe(
        (response: any) => {

          let results = response.response.ttProdutor.ttProdutor[0];
        })
    }


  };


  sucAtivas() {

    this.sucursaisService.getSucursais("1", this.susep, this.cpfCnpj).subscribe(
      response => {
        let results = response.DadosSucursais.ttDadosSucursal;
        this.sucursaisAtivas = results;
      }),
      error => {
        alert(error.statusText);
      }
  }

  selecionarCorretor(corretor: any) {
    this.nomeLista = corretor.nomProdutor;
  }


  selecionaEtapa() {
    this.selecEtapa = this.selecEtapa;
  }


  rotaBpm() {
    this.spinner.show();

    if (this.itsCpf)
      this.router.navigate(['/app-bpm' + '/' + this.susep + '/' + this.cpfCnpj + '/' + this.usuario + '/' + this.etapa]);
    else
      this.router.navigate(['/app-bpm-pj' + '/' + this.susep + '/' + this.cpfCnpj + '/' + this.usuario + '/' + this.etapa]);


    this.spinner.hide();
  }

  //   refresh(): void {
  //     window.location.reload();
  // }

  validarCaracter(event: KeyboardEvent) {

    return /^[a-zA-Z]+/g.test(event.key);
  }
}