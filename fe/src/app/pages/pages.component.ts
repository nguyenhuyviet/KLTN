import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NbDialogService } from '@nebular/theme';

import { MENU_ITEMS } from '../const/pages-menu';
import { TransferService } from '../services/transfer.service';
import { User } from '../_models/user';
import { AuthenticationService } from '../_services';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu" *ngIf="currentUser"></nb-menu>
      <router-outlet></router-outlet>

      <ng-template #dialog let-data let-ref="dialogRef">
         <div style="min-width: 700px;">

           <ngx-change-password ngi [isFisttimeLogin]="isFisttimeLogin" (eventHidden)="hiddenDialog(ref)"></ngx-change-password>
       </div>
      </ng-template>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent implements OnInit, AfterViewInit {
  currentUser: User;
  menu = MENU_ITEMS;
  isFisttimeLogin = false;
  isOpenDialogChangePw = false;
  @ViewChild('dialog') dialog;

  constructor(
    private authenticationService: AuthenticationService,
    private transferSV: TransferService,
    private dialogService: NbDialogService,

  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

    this.menu.forEach(x => {
      if (x.data.roles.includes(this.currentUser?.Role)) {
        x.hidden = false;
      } else {
        x.hidden = true;
      }
    })

  }
  ngAfterViewInit(): void {
    this.checkShowPopupChangePassword();
  }
  ngOnInit(): void {

  }

  checkShowPopupChangePassword() {
    if (this.currentUser && this.currentUser[`IsFirstTimeLogin`]) {
      this.isFisttimeLogin = true;
      if (this.dialog) {
        this.dialogService.open(this.dialog);
      }
    }
  }

  hiddenDialog(ref){
    ref.close();
  }
}
