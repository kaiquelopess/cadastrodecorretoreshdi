import { Component, OnInit } from '@angular/core';
import { CargoService } from 'src/app/services/cargo.service';
import { ConsultaDadosService } from 'src/app/services/consulta-dados.service';
import { ActivatedRoute } from '@angular/router';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-bpm-contatos-pj',
  templateUrl: './bpm-contatos-pj.component.html',
  styleUrls: ['./bpm-contatos-pj.component.css']
})
export class BpmContatosPjComponent implements OnInit {


  origem: number
  cargos: any;
  susep: string;
  cpfCnpj: string;
  consultar: [];
  listaTabela: any = [];

    salvar: any = {
      telefoneComercial: '',
      telefoneCelular: '',
      emailCorretora: '',
      emailSin: '',
      emailExt: '',
      emailRenova: '',
      cargo: {},
      cpf:'',
      nome:'',
      dataNasc: '',
      telComercial: '',
      telCelular:'',
      SbgrId: '',
      emailUsuario: ''
}

usuarioss: any = {
  nome: '',
  cpf: '',
  email: '',
  telComercial: '',
  telCelular:'',
  dataNasc: ''
}

testeArray: Array<any>;

  corretoresContatos: Array<any> =
    [{
      telefoneComercial: '',
      telefoneCelular: '',
      emailCorretora: '',
      emailSin: '',
      emailExt: '',
      emailRenova: '',
      cargo: {
        SbgrDs: ''
      },
      cpf: '',
      nome: '',
      dtNasc: '',
      telComercial: '',
      telCelular: '',
      SbgrId: '',
      emailUsuario: '',
      emailNotaFiscal: ''

    }]

  constructor(

    private CargoService: CargoService,
    private consultaDadosService: ConsultaDadosService,
    private activatedRoute: ActivatedRoute,
    private tokenService: TokenService


  ) { }

  ngOnInit() {
        this.susep = String(this.activatedRoute.snapshot.paramMap.get('susep'));
        this.cpfCnpj = String(this.activatedRoute.snapshot.paramMap.get('cpfCnpj'));
        this.origem = 1;

        this.listaCargos();
        this.consultaDados();
   
  }



  // salvarDados(idTab: any) {

  //   this.salvarDadosService.salvarDados(this.salvar).subscribe(
  //     response => {
  //       let salvar = response.response.dsDadosProdutor.dsDadosProdutor.ttDadosProdutor;

  //       this.consultaDados();

  //       $('.nav-tabs a[href="#' + idTab + '"]').tab("show");

  //     },
  //     error => {
  //       alert(error.statusText);
  //     }
  //   )
 
  // }

  consultaDados() {

    this.consultaDadosService.consultaDados(this.susep, this.cpfCnpj).subscribe(
      response => {

        let results = response.response.dsDadosProdutor.dsDadosProdutor.ttDadosProdutor[0];
        let resultss = response.response.dsDadosProdutor.dsDadosProdutor.ttUsuario[0];

        this.consultar = results;

        
        sessionStorage.setItem('nomeUsuario', resultss.nome);
        sessionStorage.setItem('emailUsuario', resultss.email);
        sessionStorage.setItem('cpfUsuario', resultss.cpf);


          sessionStorage.setItem('emailExt', results.emailExt);
          sessionStorage.setItem('emailSin', results.emailSin);
          sessionStorage.setItem('emailNf', results.emailNf);
          sessionStorage.setItem('email', results.email);
          sessionStorage.setItem('dataNasc', results.dataNasc);

          sessionStorage.setItem('codBanco', results.codBanco);
          sessionStorage.setItem('codAgencia', results.codAgencia);
          sessionStorage.setItem('codCamara', results.codCamara);
          sessionStorage.setItem('conta', results.conta);
          sessionStorage.setItem('dvAgencia', results.dvAgencia);
          sessionStorage.setItem('dvConta', results.dvConta);
          sessionStorage.setItem('telCelular', results.telCelular);
          sessionStorage.setItem('telComercial', results.telComercial);



          sessionStorage.setItem('endereco', results.endereco);
          sessionStorage.setItem('municipio', results.municipio);
          sessionStorage.setItem('complemento', results.complemento);
          sessionStorage.setItem('bairro', results.bairro);
          sessionStorage.setItem('cep', results.cep);
          sessionStorage.setItem('numero', results.numero);
          sessionStorage.setItem('uf', results.uf);

          this.usuarioss.nome = resultss.nome;
          this.usuarioss.email = resultss.email;
          this.usuarioss.cpf = resultss.cpf;
          this.usuarioss.telCelular = resultss.telCelular;
          this.usuarioss.telComercial = resultss.telComercial;
          this.usuarioss.dataNasc = resultss.dtNasc;

          this.salvar.emailExt = results.emailExt;
          this.salvar.emailSin = results.emailSin;
          this.salvar.emailNf = results.emailNf;
          this.salvar.email = results.email;


          this.salvar.codBanco = results.codBanco;
          this.salvar.codAgencia = results.codAgencia;
          this.salvar.codCamara = results.codCamara;
          this.salvar.conta = results.conta;
          this.salvar.dvAgencia = results.dvAgencia;
          this.salvar.dvConta = results.dvConta;
          this.salvar.telCelular = results.telCelular;
          this.salvar.telComercial = results.telComercial;

          this.salvar.endereco = results.endereco;
          this.salvar.municipio = results.municipio;
          this.salvar.complemento = results.complemento;
          this.salvar.bairro = results.bairro;
          this.salvar.cep = results.cep;
          this.salvar.numero = results.numero;
          this.salvar.uf = results.uf;
          this.salvar.dataNasc = results.dataNasc;

      },
      error => {
        alert(error.statusText);
      }
    )


  }



  // voltar(idTab: any) {

  //   $('.nav-tabs a[href="#' + idTab + '"]').tab("show");

  // }


  listaCargos() {

    this.CargoService.getCargos().subscribe(
      response => {
        this.cargos = response.dsIsWbSbgr.ttIsWbSbgr;

      });

    error => {
      alert(error.statusText);
    }
  }

  // listarTabela() {

  //   this.consultaDadosService.consultaDados(this.susep, this.cpfCnpj).subscribe(
  //     response => {
  //       let salvar = response.response.dsDadosProdutor.dsDadosProdutor;
  //       /**
  //        * O cadasto que retorna da HDI não trás o cargo.
  //        * Então é necessário pegar o que foi salvo e colocar no array para
  //        * que você tenha a informação.
  //        */
  //       salvar.ttUsuario[0]['cargo'] = this.salvar.cargo;

  //       this.corretoresContatos.push(salvar.ttUsuario[0]);
  //     });
  // }

}
