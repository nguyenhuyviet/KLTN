import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import * as CryptoJS from 'crypto-js';
import { AuthenticationService } from '../../_services';
import { encryptPassword } from '../../shared/fn/common.fn';
import { TransferService } from '../../services/transfer.service';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user = {
    Username: '',
    Password: ''
  };
  error;
  username = {
    empty: false,
  };

  password = {
    empty: false,
  };
  loading = false;
  formInvalid = true;

  returnUrl: string;
  constructor(
    private userSV: UserService,
    private authSV: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private transferSV: TransferService
  ) { }

  ngOnInit(): void {
    // redirect to home if already logged in
    if (this.authSV.currentUserValue) {
      this.router.navigate(['/pages/process-execution']);
    }

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }


  login() {
    this.error = "";

    if (this.validate()) {
      return;
    }

    let passwordEncrypt = encryptPassword(this.user.Password, CryptoJS).toString();

    this.authSV.login(this.user.Username, passwordEncrypt).subscribe(data => {
      if (data && data.Data) {
        localStorage.setItem('currentUser', JSON.stringify(data.Data));

        this.router.navigate([this.returnUrl]);
      } else {
        this.error = data.Message;
      }
    },
      error => {
        this.error = error;
        this.loading = false;
      });
  }

  validate() {
    let invalid = false;
    if (!this.user.Username || !this.user.Username?.trim()) {
      this.username.empty = true;
    }

    if (!this.user.Password || !this.user.Password?.trim()) {
      this.password.empty = true;

    }

    if (this.username.empty || this.password.empty) {
      invalid = true;
    }
    return invalid;
  }

  resetErr(e) {
    e.empty = false;
  }
}
