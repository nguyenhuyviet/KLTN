import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { ProcessStatusEnum } from '../../../enums/process-status.enum';
import { Paging } from '../../../models/paging';
import { ProcessService } from '../../../services/process.service';
import { UserService } from '../../../services/user.service';


@Component({
  selector: 'ngx-list-user-group',
  templateUrl: './list-user-group.component.html',
  styleUrls: ['./list-user-group.component.scss']
})
export class ListUserGroupComponent implements OnInit {

  listGroup = [];
  isLoading = false;

  paging = new Paging();

  totalRecord;


  columnMode = ColumnMode;
  colummSetting = [
    { name: 'Tên nhóm', sortable: true, prop: "UserGroupName", width: 250 },
    { name: 'Mô tả', sortable: true, prop: "Description", width: 400 },
    { name: 'Người tạo', sortable: true, prop: "CreatedBy", width: 150 },
    { name: 'Ngày tạo', sortable: true, prop: "CreatedDate", width: 150 },
    { name: 'Người sửa', sortable: true, prop: "ModifiedBy", width: 150 },
    { name: 'Ngày sửa', sortable: true, prop: "ModifiedDate", width: 150 },
  ]

  messages = {
    // Message to show when array is presented
    // but contains no values
    emptyMessage: 'Không có dữ liệu',

    // Footer total message
    totalMessage: 'bản ghi',

    // Footer selected message
    selectedMessage: 'selected'
  }


  timeOut;

  newGroup = {
    UserGroupName: '',
    Empty: false
  }

  selectionType = SelectionType;
  loadingUpdate = false;

  constructor(
    private router: Router,
    private userSV: UserService,
    private dialogService: NbDialogService
  ) {
    this.paging.CurrentPage = 1;
    this.paging.PageSize = 10;
    this.paging.FilterString = "";
  }
  ngOnInit(): void {
    this.setPage({ offset: 0 });
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
        this.getUserGroup();
      }, 1000);
    
  }

  clearSearch() {
    if(this.paging.FilterString != ""){
      this.paging.FilterString = "";
      this.getUserGroup();
    }
  }

  setPage(pageInfo) {

    this.paging.CurrentPage = pageInfo.offset + 1;
    this.getUserGroup();

  }

  getUserGroup() {
    this.isLoading = true;
    this.userSV.getPagingUserGroup(this.paging).subscribe(data => {
      if (data && data.Data && data.Data.PageData) {
        this.listGroup = data.Data.PageData;
        this.totalRecord = data.Data.TotalRecord;
      }
      this.isLoading = false;
    });
  }

  setSort(event) {
    this.paging.Sort = event.sorts[0]?.dir;
    this.paging.SortBy = event.sorts[0]?.prop;
    this.getUserGroup();
  }

  addNewUserGroup(ref){
    if(!this.newGroup.UserGroupName || !this.newGroup.UserGroupName?.trim()){
      this.newGroup.Empty = true;
      return;
    }
    this.loadingUpdate = true;
    
    this.userSV.addUserGroup(this.newGroup).subscribe(data => {
      if (data && data.Data && data.Data) {
        this.listGroup.unshift(data.Data);
        this.totalRecord++;
      }
      this.loadingUpdate = false;
    });

    ref.close();
  }

  showDialogAddGroup(dialog){
    this.dialogService.open(dialog);
  }

  resetError(){
    this.newGroup.Empty = false;
  }

  onSelectRow(e){
    this.router.navigateByUrl(`pages/user-group/${e.selected[0].UserGroupId}`);
  }
}

