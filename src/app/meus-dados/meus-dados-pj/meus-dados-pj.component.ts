import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ConsultaDadosService } from 'src/app/services/consulta-dados.service';

@Component({
	selector: 'app-meus-dados-pj',
	templateUrl: './meus-dados-pj.component.html',
	styleUrls: ['./meus-dados-pj.component.css']
})
export class MeusDadosPjComponent implements OnInit {

	origem: any;
	validarAba: boolean = false;

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private consultaDados: ConsultaDadosService) { }

	ngOnInit() {
		this.origem = Number(this.activatedRoute.snapshot.paramMap.get('origem'));
		this.validaAcompanhamento();
	}

	onNavigate(route: string) {
		this.router.navigate([`${route}${this.origem}`]);
	}

	validaAcompanhamento(){
		this.consultaDados.consultaDados().subscribe(
			(response: any) => {
                let Aba = response.response.dsDadosProdutor.dsDadosProdutor.ttDadosProdutor[0];
				if (Aba.situacao == 2){
				this.validarAba = true;
			}
			
	})
};
}
