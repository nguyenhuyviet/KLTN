import { Component } from '@angular/core';

import { MENU_ITEMS } from '../const/pages-menu';
import { User } from '../_models/user';
import { AuthenticationService } from '../_services';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu" *ngIf="currentUser"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent {
  currentUser: User;
  menu = MENU_ITEMS;
  constructor( private authenticationService: AuthenticationService){
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

    this.menu.forEach( x => {
      if(x.data.roles.includes(this.currentUser?.Role)){
        x.hidden = false;
      }else{
        x.hidden = true;
      }
    })

  }
}
