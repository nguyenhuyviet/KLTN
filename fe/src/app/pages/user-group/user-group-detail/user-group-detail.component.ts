import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { ProcessStatusEnum } from '../../../enums/process-status.enum';
import { Paging } from '../../../models/paging';
import { ProcessService } from '../../../services/process.service';
import { UserService } from '../../../services/user.service';
import { showToast } from '../../../shared/fn/common.fn';
import * as _ from "lodash";


@Component({
  selector: 'ngx-user-group-detail',
  templateUrl: './user-group-detail.component.html',
  styleUrls: ['./user-group-detail.component.scss']
})
export class UserGroupDetailComponent implements OnInit {

  userGroupID;
  userGroup;
  listUser = [];
  isLoading = false;
  loadingUpdate = false;

  paging = new Paging();

  totalRecord;


  columnMode = ColumnMode;


  messages = {
    // Message to show when array is presented
    // but contains no values
    emptyMessage: 'Không có dữ liệu',

    // Footer total message
    totalMessage: 'bản ghi',

    // Footer selected message
    selectedMessage: 'selected'
  }

  processStatusEnum = ProcessStatusEnum;

  timeOut;

  newGroup = {
    UserGroupName: '',
    Empty: false
  }

  selectionType = SelectionType;

  visibleListAddProcess = false;
  pagingAddProcess = new Paging();
  listAddProcessRes = [];
  prevScrollHeight = 0;
  listUserSelected = [];
  currentUserRemoveId;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userSV: UserService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService
  ) {
    this.paging.CurrentPage = 1;
    this.paging.PageSize = 10;
    this.paging.FilterString = "";

    this.pagingAddProcess.CurrentPage = 1;
    this.pagingAddProcess.PageSize = 10;
    this.pagingAddProcess.FilterString = "";
  }
  ngOnInit(): void {

    this.route.params.subscribe(params => {
      this.userGroupID = +params['id']; // (+) converts string 'id' to a number         
      if (this.userGroupID && !isNaN(this.userGroupID)) {
        this.getGroupDetail();
        this.setPage({ offset: 0 });
      } else {
         this.router.navigateByUrl("pages/not-found");
      }
    });

  }


  onCreateProcess() {
    this.router.navigateByUrl('pages/process/create');
  }

  searchProcess(e) {
    if (this.timeOut != null) {
      clearTimeout(this.timeOut)
    }

    this.timeOut = setTimeout(() => {
      this.paging.FilterString = e.target.value;
      this.getUser();
    }, 1000);

  }

  clearSearch() {
    if (this.paging.FilterString != "") {
      this.paging.FilterString = "";
      this.getUser();
    }
  }

  setPage(pageInfo) {

    this.paging.CurrentPage = pageInfo.offset + 1;
    this.paging.ExtraCondition = {
      UserGroupId: this.userGroupID
    }
    this.getUser();

  }
  getGroupDetail() {
    this.isLoading = true;
    this.userSV.getGroupById(this.userGroupID).subscribe(data => {
      if (data && data.Data && data.Data) {
        this.userGroup = data.Data;
      }
      this.isLoading = false;
    });
  }
  getUser() {
    this.isLoading = true;
    this.userSV.getMultiPagingInGroup(this.paging).subscribe(data => {
      if (data && data.Data && data.Data.PageData) {
        this.listUser = data.Data.PageData;
        this.totalRecord = data.Data.TotalRecord;
      }
      this.isLoading = false;
    });
  }

  setSort(event) {
    this.paging.Sort = event.sorts[0]?.dir;
    this.paging.SortBy = event.sorts[0]?.prop;
    this.getUser();
  }

  updateUserGroup(ref) {
    if (!this.newGroup.UserGroupName || !this.newGroup.UserGroupName?.trim()) {
      this.newGroup.Empty = true;
      return;
    }
    this.loadingUpdate = true;
    this.userGroup.UserGroupName = this.newGroup.UserGroupName;
    this.userSV.updateUserGroup(this.userGroup).subscribe(data => {
      if (data && data.Data && data.Data) {
        this.userGroup = data.Data;
      }
      this.loadingUpdate = false;
    });

    ref.close();
  }

  showDialogUpdateGroup(dialog) {
    this.newGroup.UserGroupName = this.userGroup.UserGroupName;
    this.dialogService.open(dialog);
  }
  showDialogRemoveProcess(dialog, process) {
    this.currentUserRemoveId = process.UserId;
    this.dialogService.open(dialog);
  }
  showDialogAddProcess(dialog) {
    this.dialogService.open(dialog);
  }

  showDialogDeleteGroup(dialog) {
    this.dialogService.open(dialog);
  }

  resetError() {
    this.newGroup.Empty = false;
  }

  onSelectRow(e) {
    // this.router.navigateByUrl(`pages/process-group/${e.selected[0].ProcessGroupId}`);
  }

  deleteGroup(ref) {
    this.userSV.deleteUserGroup(this.userGroupID).subscribe(data => {
      if (data && data.Data) {
        this.router.navigateByUrl(`pages/process-group`);
        ref.close();

      } else {
        showToast(this.toastrService, "Xóa thất bại", "danger");
      }
    });
  }

  showListAddProcess() {
    this.visibleListAddProcess = true;
    this.getData();
  }

  hideListAddProcess() {
    this.visibleListAddProcess = false;
  }


  handleScroll(e) {
    if (this.prevScrollHeight < e.target.scrollTop) {

      if (e.target.scrollTop + e.target.offsetHeight == e.target.scrollHeight) {
        this.pagingAddProcess.CurrentPage++;
        this.getData();

      }

      this.prevScrollHeight = e.target.scrollTop;
    }

  }
  getData() {

    this.pagingAddProcess.ExtraCondition = {
      UserGroupId: this.userGroupID
    }
    this.userSV.getPagingUserAddGroup(this.pagingAddProcess).subscribe(data => {
      if (data && data.Data && data.Data.PageData) {
        this.listAddProcessRes = data.Data.PageData;
      }

    });
  }


  handleSelectAddProcess(process) {
    if (process.IsChecked == null || process.IsChecked == undefined) {
      process.IsChecked = true;
    } else {
      process.IsChecked = !process.IsChecked;

    }


    if (this.listUserSelected) {

      if (process.IsChecked) {

        this.listUserSelected.push(process);
      } else {
        this.listUserSelected = this.listUserSelected.filter(x => x.ProcessId != process.ProcessId);
      }
    }
  }

  addUserToGroup(ref) {
    if (!this.listUserSelected || this.listUserSelected?.length == 0) {
      return;
    }
    this.loadingUpdate = true;
    let listUserGroupReq = [];
    this.listUserSelected.forEach(x => {
      listUserGroupReq.push({
        UserId: x.UserId,
        UserGroupId: this.userGroupID
      })
    })
    this.userSV.addUserToGroup(listUserGroupReq).subscribe(data => {
      if (data && data.Data && data.Data) {
   
          this.listUser.unshift(...this.listUserSelected);
          this.totalRecord = this.listUser.length;
          this.listUserSelected = [];
        
      }
      this.loadingUpdate = false;
      ref.close();
    });


  }

  removeProcess(ref) {
    let userGrpDetail = {
      UserGroupId: this.userGroupID,
      UserId: this.currentUserRemoveId
    }
    this.loadingUpdate = true;

    this.userSV.removeFromGroup(userGrpDetail).subscribe(data => {
      if (data && data.Data && data.Data) {
        this.listUser = this.listUser.filter(x => x.UserId != data.Data.UserId);
      }
      this.loadingUpdate = false;
      ref.close();
    });


  }

  backToListGroup() {
    this.router.navigateByUrl(`pages/user-group`);
  }
}

