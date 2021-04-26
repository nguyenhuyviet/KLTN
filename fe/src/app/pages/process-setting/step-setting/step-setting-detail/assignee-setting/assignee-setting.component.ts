import { Component, ElementRef, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { FormMode } from '../../../../../enums/form-mode.enum';
import { Paging } from '../../../../../models/paging';
import { StepAssignee } from '../../../../../models/step-assignee';
import { UserService } from '../../../../../services/user.service';
import * as _ from "lodash";
import { Output } from '@angular/core';

@Component({
  selector: 'ngx-assignee-setting',
  templateUrl: './assignee-setting.component.html',
  styleUrls: ['./assignee-setting.component.scss']
})
export class AssigneeSettingComponent implements OnInit {

  @Input() stepID;
  _assigneeType;

  _assigneeData;
  @Input()
  get assigneeData() {
    return this._assigneeData;
  }
  set assigneeData(value) {
    this._assigneeData = _.cloneDeep(value);
    this.prepareData();
  }

  @Input() readonly = true;

  visibleListAssignee = false;
  timeOutUser;

  timeOutGroup;

  pagingUser = {
    CurrentPage: 0,
    PageSize: 10,
    FilterString: '',
    PrevPage: null
  }

  listAssigneeData = [];


  listNewAssingeeData: [StepAssignee];

  prevScrollHeight = 0;


  isLoadingUser;

  listUserRes = [];
  listGroupUserRes = [];
  filterType = 1; // 1 user, 2 group user

  currentPageUser = 0;
  currentPageGroup = 0;
  prevPageUser = null;
  prevPageGroup = null;
  @ViewChild('listAssigneeElm') listAssigneeElm: ElementRef;

  @Output() onSave: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();


  constructor(
    private userSV: UserService
  ) { }

  ngOnInit(): void {
  }

  prepareData() {
    if (this.assigneeData) {
      this.listAssigneeData = _.cloneDeep(this.assigneeData);
    } else {

    }
  }


  showListAssignee() {
    this.visibleListAssignee = true;
    this.getData();
  }

  hideListAssignee() {
    this.visibleListAssignee = false;
  }
  searchProcess(e) {
    if (this.timeOutUser != null) {
      clearTimeout(this.timeOutUser)
    }

    this.timeOutUser = setTimeout(() => {
      this.pagingUser.CurrentPage = 0;
      this.prevPageGroup =null;
      this.prevPageUser =null;
      this.currentPageGroup = 0;
      this.currentPageGroup =0 ;
      this.pagingUser.FilterString = e.target.value;
      this.getData(true);
    }, 1000);

  }

  clearSearch() {
    if (this.pagingUser.FilterString != "") {
      this.pagingUser.FilterString = "";
      this.getData();
    }
  }

  getUser(fromSearch = false) {
    if (this.prevPageUser == this.currentPageUser) {
      return;
    }

    this.isLoadingUser = true;
    this.pagingUser.CurrentPage = this.currentPageUser;
    this.userSV.getInStepSetting(this.pagingUser).subscribe(data => {
      if (data && data.Data) {
        this.checkUserChecked(data.Data.PageData);
        if(fromSearch){
          this.listUserRes = data.Data.PageData;
        }else{
          this.listUserRes.push(...data.Data.PageData);
          this.prevPageUser = this.currentPageUser;
        }

      }
      this.isLoadingUser = false;
    });
  }

  getUGroupUser(fromSearch = false) {

    if (this.prevPageGroup == this.currentPageGroup) {
      return;
    }

    this.isLoadingUser = true;
    this.pagingUser.CurrentPage = this.currentPageGroup;
    this.userSV.getGroupInStepSetting(this.pagingUser).subscribe(data => {
      if (data && data.Data) {
        this.checkUserChecked(data.Data.PageData, true);
        if(fromSearch){
          this.listGroupUserRes = data.Data.PageData;
        }else{
          this.listGroupUserRes.push(...data.Data.PageData);
          this.prevPageGroup = this.currentPageUser;
        }
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

  getData(fromSearch = false) {
    if (this.filterType == 2) {
      this.getUGroupUser(fromSearch);
    } else {

      this.getUser(fromSearch);
    }
  }

  handleScroll(e) {
    if (this.prevScrollHeight < e.target.scrollTop) {

      if (e.target.scrollTop + e.target.offsetHeight == e.target.scrollHeight) {
        if (this.filterType == 2) {
          this.currentPageGroup++;

        } else {
          this.currentPageUser++;

        }

        this.getData();

      }

      this.prevScrollHeight = e.target.scrollTop;
    }

  }


  handleCheckbox(checked, option) {
    option.Checked = checked;
  }

  checkUserChecked(arraySource, isGroup = false) {
    this.listAssigneeData.forEach(x => {
      arraySource.forEach(item => {
        if (isGroup) {
          if (x.UserGroup && x.UserGroup.UserGroupId == item.UserGroupId) {
            item.IsChecked = true;
          }
        } else {
          if (x.User && x.User.UserId == item.UserId) {
            item.IsChecked = true;
          }
        }
      });
    })
  }

  handleSelectAssignee(user, isGroup = false) {
    if (user.IsChecked == null || user.IsChecked == undefined) {
      user.IsChecked = true;
    } else {
      user.IsChecked = !user.IsChecked;

    }


    if (this.listAssigneeData && this.listAssigneeData.length > 0) {
      if (isGroup) {
        if (user.IsChecked) {
          const newAssigne = {
            ProcessStepId: this.stepID,
            UserId: null,
            UserGroupId: user.UserGroupId,
            User: null,
            UserGroup: user
          }
          this.listAssigneeData.push(newAssigne);
        } else {
          this.listAssigneeData = this.listAssigneeData.filter(x => x.UserGroup.UserGroupId != user.UserGroupId);
        }

      } else {
        if (user.IsChecked) {
          const newAssigne = {
            ProcessStepId: this.stepID,
            UserId: user.UserId,
            User: user,
          }
          this.listAssigneeData.push(newAssigne);
        } else {
          this.listAssigneeData = this.listAssigneeData.filter(x => x.User.UserId != user.UserId);
        }

      }
    }
  }

  save() {
    this.onSave.emit(this.listAssigneeData);
  }
  cancel() {
    this.onCancel.emit();
    this.listAssigneeData = _.cloneDeep(this.assigneeData);
  }
}
