import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-agradecimento',
  templateUrl: './agradecimento.component.html',
  styleUrls: ['./agradecimento.component.css']
})
export class AgradecimentoComponent implements OnInit {
origem: number;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  irAgradecimento(){
    this.router.navigate(['app-agradecimento/' + this.origem]);
  }
}
