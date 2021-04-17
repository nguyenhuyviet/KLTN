import { Component, Input, OnInit } from '@angular/core';
import { FormMode } from '../../../../../enums/form-mode.enum';
import { Paging } from '../../../../../models/paging';
import { StepAssignee } from '../../../../../models/step-assignee';
import { UserService } from '../../../../../services/user.service';

@Component({
  selector: 'ngx-assignee-setting',
  templateUrl: './assignee-setting.component.html',
  styleUrls: ['./assignee-setting.component.scss']
})
export class AssigneeSettingComponent implements OnInit {

  @Input() formMode = FormMode.Insert;

  @Input() assigneeData;

  visibleListAssignee = false;
  timeOutUser;

  timeOutGroup;

  pagingUser = {
    CurrentPage: 0,
    PageSize: 10,
    FilterString: '',
  }

  listUserDisplay = [];


  listNewAssingeeData: [StepAssignee];

  optionSelect = [
    {
      Value: 1,
      Text: "Chọn người"
    },
    {
      Value: 2,
      Text: "Chọn nhóm"
    }
  ]


  isLoadingUser;

  listUserRes = [];
  listGroupUserRes = [];
  filterType = 1; // 1 user, 2 group user

  constructor(
    private userSV: UserService
  ) { }

  ngOnInit(): void {
  }

  showListAssignee(){
    this.visibleListAssignee = true;
    this.getData();
  }

  hideListAssignee(){
    this.visibleListAssignee = false;
  }
  searchProcess(e) {
    if (this.timeOutUser != null) {
      clearTimeout(this.timeOutUser)
    }

    this.timeOutUser = setTimeout(() => {
      this.pagingUser.FilterString = e.target.value;
      this.getData();
    }, 1000);

  }

  clearSearch() {
    if (this.pagingUser.FilterString != "") {
      this.pagingUser.FilterString = "";
      this.getData();
    }
  }

  getUser() {

    this.isLoadingUser = true;
    this.userSV.getInStepSetting(this.pagingUser).subscribe(data => {
      if (data && data.Data) {
        this.listUserRes = data.Data.PageData;
      }
      this.isLoadingUser = false;
    });
  }

  getUGroupUser() {

    this.isLoadingUser = true;
    this.userSV.getGroupInStepSetting(this.pagingUser).subscribe(data => {
      if (data && data.Data) {
        this.listGroupUserRes = data.Data.PageData;
      }
      this.isLoadingUser = false;
    });
  }


  setFilterType(isGroup = false) {
    if (isGroup) {
      this.filterType = 2;
      this.getUGroupUser();
    } else {
      this.filterType = 1;
      this.getUser();
    }
  }

  getData() {
    if (this.filterType == 2) {
      this.getUGroupUser();
    } else {
     
      this.getUser();
    }
  }
}
