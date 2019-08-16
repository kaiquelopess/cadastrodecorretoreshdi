import { Routes } from '@angular/router';

// Components
import { TabsComponent } from './tabs/tabs-pf/tabs.component';
import { MeusDadosComponent } from './meus-dados/meus-dados.component';
import { MeusDadosPjComponent } from './meus-dados/meus-dados-pj/meus-dados-pj.component';
import { LoginPrimarioComponent } from './login-primario/login-primario.component';
import { JaSouCadastradoComponent } from './ja-sou-cadastrado/ja-sou-cadastrado.component';
import { EsqueceuSenhaComponent } from './esqueceu-senha/esqueceu-senha.component';
import { InformeNovaSenhaComponent } from './informe-nova-senha/informe-nova-senha.component';
import { PrimeiroAcessoComponent } from './primeiro-acesso/primeiro-acesso.component';
import { RedirecionamentoHdidigitalComponent } from './redirecionamento-hdidigital/redirecionamento-hdidigital.component';
import { AcompanhamentoValidacaoComponent } from './acompanhamento-validacao/acompanhamento-validacao.component';

export const appRoutes: Routes = [
    { path: 'login/:origem', component: JaSouCadastradoComponent },
    { path: 'app-login-primario/:origem', component: LoginPrimarioComponent},
    { path: 'app-tabs/:origem', component: TabsComponent },
    { path: 'app-meus-dados/:origem', component: MeusDadosComponent},
    { path: 'app-meus-dados-pj/:origem', component: MeusDadosPjComponent},
    { path: 'app-ja-sou-cadastrado/:origem', component: JaSouCadastradoComponent},
    { path: 'app-esqueceu-senha/:origem', component: EsqueceuSenhaComponent},
    { path: 'app-informe-nova-senha/:origem', component: InformeNovaSenhaComponent},
    { path: 'app-primeiro-acesso/:origem', component: PrimeiroAcessoComponent},
    { path: 'app-redirecionamento-hdi-digital/:origem', component: RedirecionamentoHdidigitalComponent},
    { path: 'app-acompanhamento-validacao/:origem', component: AcompanhamentoValidacaoComponent},
    { path: '', redirectTo: 'login/1?codorigem=hdi', pathMatch: 'full' }
];
