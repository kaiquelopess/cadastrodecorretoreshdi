import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MeusDadosComponent } from './meus-dados.component';
import { TabsComponent } from '../tabs/tabs-pf/tabs.component';
import { DadosCadastraisPfComponent } from '../dados-cadastrais-pf/dados-cadastrais-pf1/dados-cadastrais-pf.component';
import { DadosCadastraisPf2Component } from '../dados-cadastrais-pf/dados-cadastrais-pf2/dados-cadastrais-pf2.component';
import { DadosCadastraisPf4Component } from '../dados-cadastrais-pf/dados-cadastrais-pf4/dados-cadastrais-pf4.component';
import { MeusDadosPjComponent } from './meus-dados-pj/meus-dados-pj.component';
import { DadosCadastraisPjComponent } from '../dados-cadastrais-pj/dados-cadastrais-pj1/dados-cadastrais-pj.component';
import { DadosCadastraisPj4Component } from '../dados-cadastrais-pj/dados-cadastrais-pj4/dados-cadastrais-pj4.component';
import { DadosCadastraisPj2Component } from '../dados-cadastrais-pj/dados-cadastrais-pj2/dados-cadastrais-pj2.component';

const routes: Routes = [
  {
    path: 'app-meus-dados/:origem',
    component: MeusDadosComponent,
    children: [
      {
        path: 'dados-cadastrais-pf',
        component: DadosCadastraisPfComponent
      },
      {
        path: 'dados-cadastrais-pf2',
        component: DadosCadastraisPf2Component
      },
      {
        path: 'dados-cadastrais-pf4',
        component: DadosCadastraisPf4Component
      },
      {
        path: '',
        redirectTo: 'dados-cadastrais-pf',
        pathMatch: 'full'
      }
    ]
  },

  {
    path: 'app-meus-dados-pj/:origem',
    component: MeusDadosPjComponent,
    children: [
      {
        path: 'dados-cadastrais-pj',
        component: DadosCadastraisPjComponent
      },
      {
        path: 'dados-cadastrais-pj2',
        component: DadosCadastraisPj2Component
      },
      {
        path: 'dados-cadastrais-pj4',
        component: DadosCadastraisPj4Component
      },
      {
        path: '',
        redirectTo: 'dados-cadastrais-pj',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class MeusDadosRoutingModule { }
