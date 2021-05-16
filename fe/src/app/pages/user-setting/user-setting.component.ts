
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { ProcessStatusEnum } from '../../enums/process-status.enum';
import { Paging } from '../../models/paging';
import { ProcessService } from '../../services/process.service';
import { UserService } from '../../services/user.service';
import { showToast } from '../../shared/fn/common.fn';
import * as _ from "lodash";
import * as xlsx from "xlsx";
import { FormMode } from '../../enums/form-mode.enum';


@Component({
  selector: 'ngx-user-setting',
  templateUrl: './user-setting.component.html',
  styleUrls: ['./user-setting.component.scss']
})
export class UserSettingComponent implements OnInit {

  listUserErr = [];
  listUserAdd = [];

  userGroupID;
  userGroup;
  listUser = [];
  isLoading = false;
  loadingUpdate = false;

  paging = new Paging();
  pagingError = new Paging();
  pagingAdd = new Paging();

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


  // newUser = {
  //   FullName: "",
  //   Email: "",
  //   DateOfBirth: new Date(),
  //   Phone: "",
  //   Address: "",
  //   RoleId: null,
  //   UserLogin: {
  //     Username: '',
  //     Password: ''
  //   }
  // };
  newUser;

  formMode;
  formModeEnum = FormMode;
  error = {
    FullName: {
      Empty: null
    },
    Email: {
      Empty: null
    },
    DateOfBirth: {
      Empty: null
    },
    Phone: {
      Empty: null
    },
    Address: {
      Empty: null
    },
    RoleId: {
      Empty: null
    },
    UserLogin: {
      Username: {
        Empty: null
      },
      Password: {
        Empty: null
      },
    }
  };

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
    this.getUser();

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

  setPageDialog(pageInfo, paging) {
    paging.CurrentPage = pageInfo.offset + 1;
  }


  setSortDialog(event, paging) {
    paging.Sort = event.sorts[0]?.dir;
    paging.SortBy = event.sorts[0]?.prop;
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
    this.userSV.getPaging(this.paging).subscribe(data => {
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
    this.deleteError = false;
    this.currentUserRemoveId = process.UserId;
    this.dialogService.open(dialog);
  }
  showDialogRemoveUser(dialog, row, list) {
    if (list && list.length > 0) {
      const i = list.indexOf(row);
      if (i != -1) {
        list.splice(i, 1);

      }
    }
  }

  showDialogAddProcess(dialog, data = null) {
    if (data) {
      this.formMode = FormMode.Update;
      this.newUser = {
        UserId: data.UserId,
        FullName: data.FullName,
        Email: data.Email,
        DateOfBirth: new Date(data.DateOfBirth),
        Phone: data.Phone,
        Address: data.Address,
        RoleId: data.RoleId,
        UserLogin: {
          Username: '',
          Password: ''
        }
      };
    } else {
      this.formMode = FormMode.Insert;

      this.newUser = {
        FullName: "",
        Email: "",
        DateOfBirth: null,
        Phone: "",
        Address: "",
        RoleId: null,
        UserLogin: {
          Username: '',
          Password: ''
        }
      };
    }
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

  addUser(ref) {
    this.loadingAddUser = true;

    const user = {
      UserId: this.newUser[`UserId`],
      Username: this.newUser.UserLogin.Username,
      Password: this.newUser.UserLogin.Password,
      User: {
        FullName: this.newUser.FullName,
        Email: this.newUser.Email,
        DateOfBirth: this.newUser.DateOfBirth ? new Date(this.newUser.DateOfBirth) : new Date(),
        Phone: this.newUser.Phone,
        Address: this.newUser.Address,
        RoleId: this.newUser.RoleId,
        UserLogin: {
          Username: this.newUser.UserLogin.Username,
          Password: this.newUser.UserLogin.Password,
        }
      }
    }

    this.userSV.addUser(user).subscribe(data => {
      if (data && data.Data && data.Data) {
        if (this.formMode == FormMode.Insert) {

          this.listUser.unshift(data.Data);
        } else {
          let index = this.listUser.findIndex(x => x.UserId == data.Data.UserId);
          if (index != -1) {
            this.listUser[index] = _.cloneDeep(data.Data);
          }
        }

        showToast(this.toastrService, "Thêm thành công", "success");
      } else {
        showToast(this.toastrService, "Thêm thất bại", "danger");
      }
      this.loadingAddUser = false;
      ref.close();
    });


  }
  
  deleteError = false;
  removeUser(ref) {
    this.deleteError = false;
    this.loadingUpdate = true;

    this.userSV.delete(this.currentUserRemoveId).subscribe(data => {
      if (data && data.Data && data.Data) {
        this.listUser = this.listUser.filter(x => x.UserId != data.Data.UserId);
        ref.close();
      } else {
        this.deleteError = true;
      }
      this.loadingUpdate = false;

    });


  }

  backToListGroup() {
    this.router.navigateByUrl(`pages/user-group`);
  }

  previewFiles(e, dialog, ref) {

    var file = e.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    fileReader.onload = (e) => {
      var arrayBuffer = fileReader.result;
      var data = new Uint8Array(arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = xlsx.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      var arraylist = xlsx.utils.sheet_to_json(worksheet, { raw: true });
      let duplicateUserName;
      if (arraylist && arraylist.length > 0) {
        duplicateUserName = _.uniqBy(arraylist, "Username")
      }

      this.listUserErr = _.differenceWith(arraylist, duplicateUserName, _.isEqual);

      this.listUserAdd = _.cloneDeep(duplicateUserName);

      this.showDialog(dialog);
      ref.close();
    }
  }

  showDialog(dialog) {
    this.dialogService.open(dialog);
  }

  loadingAddUser = false;
  DataSuccess = [];
  DataFailed = [];

  addMultiUser(ref, dialog) {
    this.loadingAddUser = true;
    const list = [];
    if (this.listUserAdd) {
      this.listUserAdd.forEach(element => {
        list.push({
          Username: element.Username,
          Password: element.Password,
          User: {
            FullName: element.FullName,
            Email: element.Email,
            DateOfBirth: element.DateOfBirth ? new Date(element.DateOfBirth) : new Date(),
            Phone: element.Phone,
            Address: element.Address,
            RoleId: element.RoleId,
            UserLogin: {
              Username: element.Username,
              Password: element.Password,
            }
          }
        });
      });
      this.DataSuccess = [];
      this.DataFailed = [];

      this.userSV.addMultiUser(list).subscribe(data => {
        if (data && data.Data && data.Data) {
          this.showDialog(dialog);
          this.DataSuccess = data.Data.DataSuccess;
          this.DataFailed = data.Data.DataFailed;
          showToast(this.toastrService, "Thêm thành công", "success");
        } else {
          showToast(this.toastrService, "Thêm thất bại", "danger");
        }
        this.loadingAddUser = false;
        ref.close();
      });
    }
  }

}
