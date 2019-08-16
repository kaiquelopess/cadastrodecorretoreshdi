import { Component, OnInit } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-informe-nova-senha',
  templateUrl: './informe-nova-senha.component.html',
  styleUrls: ['./informe-nova-senha.component.css']
})
export class InformeNovaSenhaComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

}
