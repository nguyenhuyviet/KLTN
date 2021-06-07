
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

import { UserService } from '../../../services/user.service';
import * as CryptoJS from 'crypto-js';
import { encryptPassword, showToast } from '../../fn/common.fn';
import { NbToastrService } from '@nebular/theme';
import { AuthenticationService } from '../../../_services';

@Component({
  selector: 'ngx-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  message = "";
  pwObj = {
    oldPw: {
      Value: "",
      IsBlank: false,
    },
    newPw: {
      Value: "",
      IsBlank: false,
    },
    retypeNewPw: {
      Value: "",
      IsBlank: false,
    },
  }

  isLoadingBtn = false;

  @Input() isFisttimeLogin;

  @Output() eventHidden = new EventEmitter();

  currentUser;

  constructor(
    private userSV: UserService,
    private toastSV: NbToastrService,
    private authenticationService: AuthenticationService,

  ) {

    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit(): void {



  }


  submitForm() {
    if (this.validate()) {
      return;
    }
    var key = "b14ca5898a4e4133bbce2ea2315a1916";

    var userLogin = {
      OldPassword: encryptPassword(this.pwObj.oldPw.Value, CryptoJS).toString(),
      NewPassword: encryptPassword(this.pwObj.newPw.Value, CryptoJS).toString()
    }
    this.changePassword(userLogin);

  }

  changePassword(newPassword) {
    this.isLoadingBtn = true;
    this.userSV.changePassword(newPassword).subscribe(data => {
      if (data) {
        if (data.Code === 1) {
          this.currentUser[`IsFirstTimeLogin`] = false;
          localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
          showToast(this.toastSV, "Đổi mật khẩu thành công", "success")
          this.eventHidden.emit();
        } else if (data.Code === 10) {
          this.message = "Mật khẩu không đúng";
        } else if (data.Code === 11) {
          this.message = "Không tim thấy người dùng";
        }
      } else {
        this.message = "Có lỗi xảy ra";
      }

      this.isLoadingBtn = false;
    })

  }

  validate() {
    this.pwObj.oldPw.IsBlank = false;
    this.pwObj.newPw.IsBlank = false;
    this.pwObj.retypeNewPw.IsBlank = false;
    this.message = "";
    let inValid = false;

    for (const key in this.pwObj) {
      if (Object.prototype.hasOwnProperty.call(this.pwObj, key)) {
        const element = this.pwObj[key];
        if (!element.Value) {
          element.IsBlank = true;
          inValid = true;
          this.message = "Trường dữ liệu không được để trống";

        }
      }
    }

    if (this.pwObj.newPw.Value !== this.pwObj.retypeNewPw.Value) {
      if (!this.message) {
        this.message = "Giá trị nhập lại mật khẩu không trùng khớp";
      }
      inValid = true;
    }


    return inValid;
  }

  resetError(obj) {
    obj.IsBlank = false;
  }

  close() {
    if (this.isFisttimeLogin) {
      this.userSV.updateFirstTimeLogin().subscribe(data => {
        if (data && data.Code === 1) {
          showToast(this.toastSV, "Bạn nên đổi mật khẩu để tăng cường bảo mật", "warning");
          this.currentUser[`IsFirstTimeLogin`] = false;
          localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        } else {

        }
        this.eventHidden.emit();
      })
    } else {

      this.eventHidden.emit();
    }


  }
}

