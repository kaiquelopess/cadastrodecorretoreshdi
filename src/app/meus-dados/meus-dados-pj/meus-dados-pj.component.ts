import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
	selector: 'app-meus-dados-pj',
	templateUrl: './meus-dados-pj.component.html',
	styleUrls: ['./meus-dados-pj.component.css']
})
export class MeusDadosPjComponent implements OnInit {

	origem: any;

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router) { }

	ngOnInit() {
		this.origem = Number(this.activatedRoute.snapshot.paramMap.get('origem'));
	}

	onNavigate(route: string) {
		this.router.navigate([`${route}${this.origem}`]);
	}
}
