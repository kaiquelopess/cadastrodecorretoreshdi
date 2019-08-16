import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private tokenService: TokenService
  ) { 
     this.tokenService.getToken().subscribe(
    data => {
      sessionStorage.setItem('token', data.access_token);
    });
  }

  ngOnInit() {
  }

}
