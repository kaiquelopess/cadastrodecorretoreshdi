import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-tabs-pj',
  templateUrl: './tabs-pj.component.html',
  styleUrls: ['./tabs-pj.component.css']
})
export class TabsPJComponent implements OnInit {

  tab = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.tab = 'registro';
  }
}
