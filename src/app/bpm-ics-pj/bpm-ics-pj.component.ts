import { Component, OnInit } from '@angular/core';
import { PepService } from '../services/pep.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { TokenService } from '../services/token.service';
import { SusepCnpjService } from '../services/susep-cnpj.service';
import { ConsultaOrigemService } from '../services/origem.service';
import { NgxMaskModule } from 'ngx-mask';
import { ConsultaDadosService } from '../services/consulta-dados.service';

@Component({
  selector: 'app-bpm-ics-pj',
  templateUrl: './bpm-ics-pj.component.html',
  styleUrls: ['./bpm-ics-pj.component.css']
})
export class BpmIcsPjComponent implements OnInit {
  origem: number = 1;
  salvarDados: any = [];
  registroAdm: string;
  registroProc: string;
  registroCont: string;
  susep: string;
  cpfCnpj: string;
  dados: any;
  mask = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];

  administrador: any = [];
  controlador: any = [];
  procurador: any = [];

  salvar: any = {
    registroSusep: '',
    nome: '',
    cnpjCpf: '',
    tipoPessoa: '',
    cpfAdm: '',
    nomeAdm: '',
    cpfProc: '',
    nomeProc: '',
    cpfCont: '',
    nomeCont: '',
  }

  salvarpep: any = {
    nome: '',
    cnpjCpf: '',
    tipoPessoa: '',
  
    atividadePrincipal: '',
    valorCapitalSocial: '',
    faturamentoPresumido: ''
  }

  constructor(
    private PepService: PepService,
    private router: Router,
    private tokenService: TokenService,
    private SusepCnpjService: SusepCnpjService,
    private ConsultaOrigemService: ConsultaOrigemService,
    private activatedRoute: ActivatedRoute,
    private NgxMaskModule: NgxMaskModule,
    private consultaDadosService: ConsultaDadosService

  ) {
  }

  ngOnInit() {


    this.susep = String(this.activatedRoute.snapshot.paramMap.get('susep'));
    this.cpfCnpj = String(this.activatedRoute.snapshot.paramMap.get('cpfCnpj'));

    this.equifaxgo(this.salvarpep);
  }

  equifaxgo(salvarpep: any) {

    this.tokenService.getToken().subscribe(
      data => {
        sessionStorage.setItem('token', data.access_token);

        // this.SusepCnpjService.getSusep('1', '00000100195995', '60888898000108');

        // this.consultaOrigem(this.origem);
        // sessionStorage.setItem('origem', this.origem.toString());

        this.salvar.registroSusep = this.susep;
        this.salvar.cnpjCpf = this.cpfCnpj;

        this.consultaDadosService.consultaDados(this.susep, this.cpfCnpj).subscribe(
          (response: any) => {

            let results = response.response.dsDadosProdutor.dsDadosProdutor.ttDadosProdutor[0];


            this.salvarpep.nome = results.nome;
            this.salvarpep.cnpjCpf = results.cpfcnpj;
            this.salvarpep.tipoPessoa = results.tipPessoa;




            this.PepService.pepService(this.salvarpep).subscribe(
              (response: any) => {

                let resultsCadastro = response.DsEquifaxSaida.cadastro[0];

                this.salvarpep.atividadePrincipal = resultsCadastro.descatividade;
                this.salvarpep.valorCapitalSocial = resultsCadastro.vlcapital;
                this.salvarpep.faturamentoPresumido = resultsCadastro.vlfatpresumido;


                this.administrador = response.DsEquifaxSaida.administrador;
                this.controlador = response.DsEquifaxSaida.controlador;
                this.procurador = response.DsEquifaxSaida.procurador;

                this.registroAdm;
                this.registroProc;
                this.registroCont;

                let resultsAdm = response.DsEquifaxSaida.administrador[0];
                if (resultsAdm == undefined) {
                  this.salvar.cpfAdm && this.salvar.nomeAdm == '';
                  this.registroAdm = "Não há registros";

                } else this.registroAdm = "Há registros";

                let registroPepAdm: any = response.DsEquifaxSaida.administrador
                  .filter((resultsAdm: any) => {
                    return resultsAdm.flgpep === 'TRUE';
                  });


                if (registroPepAdm.length > 0) {
                  this.registroAdm = "Há Registros COM PEP";
                  this.registroAdm = this.registroAdm;
                } else {
                  this.registroAdm = this.registroAdm;
                };

                this.registroAdm;

                let resultsProc = response.DsEquifaxSaida.procurador[0];
                if (resultsProc == undefined) {
                  this.salvar.cpfProc && this.salvar.nomeProc == '';
                  this.registroProc = "Não há registros";
                } else this.registroProc = "Há registros";

                let registroPepProc: any = response.DsEquifaxSaida.procurador
                  .filter((resultsProc: any) => {
                    return resultsProc.flgpep === 'TRUE';
                  });


                if (registroPepProc.length > 0) {
                  this.registroProc = "Há Registros COM PEP";
                  this.registroProc = this.registroProc;
                } else {
                  this.registroProc = this.registroProc;
                };

                this.registroProc;


                let resultsCont = response.DsEquifaxSaida.controlador[0];
                if (resultsCont == undefined) {
                  this.salvar.cpfCont && this.salvar.nomeCont == '';
                  this.registroCont = "Não há registros";
                } else this.registroCont = "Há registros";

                let registroPepCont: any = response.DsEquifaxSaida.controlador
                  .filter((resultsCont: any) => {
                    return resultsCont.flgpep === 'TRUE';
                  });

                if (registroPepCont.length > 0) {
                  this.registroCont = "Há Registros COM PEP";
                  this.registroCont = this.registroCont;
                } else {
                  this.registroCont = this.registroCont;
                };

                this.registroCont;


                if (resultsAdm == undefined) {
                  resultsAdm = resultsAdm;
                } else {
                  this.salvar.cpfAdm = resultsAdm.cpf;
                  this.salvar.nomeAdm = resultsAdm.nome;
                }

                if (resultsCont == undefined) {
                  resultsCont = resultsCont;
                } else {
                  this.salvar.cpfCont = resultsCont.cpf;
                  this.salvar.nomeCont = resultsCont.nome;
                }

                if (resultsProc == undefined) {
                  resultsProc = resultsProc;
                } else {
                  this.salvar.cpfProc = resultsProc.cpf;
                  this.salvar.nomeProc = resultsProc.nome;
                }


              }
            )
          }
        )
      }
    )

  };

  consultaOrigem(origem: number) {

    this.tokenService.getToken().subscribe(
      data =>
        sessionStorage.setItem('token', data.access_token),

      this.ConsultaOrigemService.consultaOrigem(origem).subscribe(
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
    )
  }



  //   salvarDados(idTab: any) {

  //     $('.nav-tabs a[href="#'+idTab+'"]').tab("show");

  // }



  // registros() {
  //   if (this.salvar.nome === '') {
  //     this.registroAdm = "Não há registros";
  //     this.registroProc = "Não há registros";
  //     this.registroCont = "Não há registros";
  //     return this.registroAdm, this.registroProc, this.registroCont;
  //   } else {
  //     this.registroAdm = "Há registros";
  //     this.registroProc = "Há registros";
  //     this.registroCont = "Há registros";
  //     return this.registroAdm, this.registroProc, this.registroCont;
  //   }
  // }
}
