import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
	selector: 'app-meus-dados',
	templateUrl: './meus-dados.component.html',
	styleUrls: ['./meus-dados.component.css']
})
export class MeusDadosComponent implements OnInit {

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