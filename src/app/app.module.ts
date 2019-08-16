import { BrowserModule } from '@angular/platform-browser';
import {NgModule, CUSTOM_ELEMENTS_SCHEMA, APP_INITIALIZER} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPrimarioComponent } from './login-primario/login-primario.component';
import { DadosCadastraisPjComponent } from './dados-cadastrais-pj/dados-cadastrais-pj1/dados-cadastrais-pj.component';
import { DadosCadastraisPj2Component } from './dados-cadastrais-pj/dados-cadastrais-pj2/dados-cadastrais-pj2.component';
import { DadosCadastraisPj3Component } from './dados-cadastrais-pj/dados-cadastrais-pj3/dados-cadastrais-pj3.component';
import { DadosCadastraisPj4Component } from './dados-cadastrais-pj/dados-cadastrais-pj4/dados-cadastrais-pj4.component';
import { AcompanhamentoValidacaoComponent } from './acompanhamento-validacao/acompanhamento-validacao.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { AcompanhamentoValidacao2Component } from './acompanhamento-validacao2/acompanhamento-validacao2.component';
import { DadosCadastraisPfComponent } from './dados-cadastrais-pf/dados-cadastrais-pf1/dados-cadastrais-pf.component';
import { DadosCadastraisPf2Component } from './dados-cadastrais-pf/dados-cadastrais-pf2/dados-cadastrais-pf2.component';
import { DadosCadastraisPf3Component } from './dados-cadastrais-pf/dados-cadastrais-pf3/dados-cadastrais-pf3.component';
import { DadosCadastraisPf4Component } from './dados-cadastrais-pf/dados-cadastrais-pf4/dados-cadastrais-pf4.component';
import { CnpjCpfFormatPipe } from './pipes/cnpj-cpf-format.pipe';
import { NumbersOnlyDirective } from './directives/numbers-only.directive';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app.routes';
import { PrimeiroAcessoComponent } from './primeiro-acesso/primeiro-acesso.component';
import { RedirecionamentoHdidigitalComponent } from './redirecionamento-hdidigital/redirecionamento-hdidigital.component';
import { EsqueceuSenhaComponent } from './esqueceu-senha/esqueceu-senha.component';
import { InformeNovaSenhaComponent } from './informe-nova-senha/informe-nova-senha.component';
import { JaSouCadastradoComponent } from './ja-sou-cadastrado/ja-sou-cadastrado.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { TabsComponent } from './tabs/tabs-pf/tabs.component';
import { MeusDadosComponent } from './meus-dados/meus-dados.component';
import { TabsPJComponent } from './tabs/tabs-pj/tabs-pj.component';
import { MeusDadosPjComponent } from './meus-dados/meus-dados-pj/meus-dados-pj.component';
import {NgxMaskModule} from 'ngx-mask';
import { AgradecimentoComponent } from './agradecimento/agradecimento.component';
import { UploadComponent } from './upload/upload.component';
import { TextOnlyDirective } from './directives/text-only.directive';
import { MeusDadosRoutingModule } from './meus-dados/meus-dados-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    DadosCadastraisPjComponent,
    DadosCadastraisPj2Component,
    DadosCadastraisPj3Component,
    DadosCadastraisPj4Component,
    AcompanhamentoValidacaoComponent,
    AcompanhamentoValidacao2Component,
    DadosCadastraisPfComponent,
    DadosCadastraisPf2Component,
    DadosCadastraisPf3Component,
    DadosCadastraisPf4Component,
    CnpjCpfFormatPipe,
    NumbersOnlyDirective,
    PrimeiroAcessoComponent,
    RedirecionamentoHdidigitalComponent,
    EsqueceuSenhaComponent,
    InformeNovaSenhaComponent,
    JaSouCadastradoComponent,
    TabsComponent,
    MeusDadosComponent,
    TabsPJComponent,
    MeusDadosPjComponent,
    LoginPrimarioComponent,
    AgradecimentoComponent,
    UploadComponent,
    TextOnlyDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MeusDadosRoutingModule,
    AngularFontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    NgxPaginationModule,
    NgxMaskModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule { }
