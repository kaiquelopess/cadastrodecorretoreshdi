import { Component, OnInit } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-redirecionamento-hdidigital',
  templateUrl: './redirecionamento-hdidigital.component.html',
  styleUrls: ['./redirecionamento-hdidigital.component.css']
})
export class RedirecionamentoHdidigitalComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

}
