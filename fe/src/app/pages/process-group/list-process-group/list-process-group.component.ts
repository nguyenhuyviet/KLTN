
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { ProcessStatusEnum } from '../../../enums/process-status.enum';
import { Paging } from '../../../models/paging';
import { ProcessService } from '../../../services/process.service';


@Component({
  selector: 'ngx-list-process-group',
  templateUrl: './list-process-group.component.html',
  styleUrls: ['./list-process-group.component.scss']
})
export class ListProcessGroupComponent implements OnInit {

  listProcess = [];
  isLoading = false;
  loadingUpdate = false;

  paging = new Paging();

  totalRecord;


  columnMode = ColumnMode;
  colummSetting = [
    { name: 'Tên nhóm', sortable: true, prop: "ProcessGroupName", width: 250 },
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

  processStatusEnum = ProcessStatusEnum;

  timeOut;

  newGroup = {
    ProcessGroupName: '',
    Empty: false
  }

  selectionType = SelectionType;

  constructor(
    private router: Router,
    private processSV: ProcessService,
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
        this.getProcessGroup();
      }, 1000);
    
  }

  clearSearch() {
    if(this.paging.FilterString != ""){
      this.paging.FilterString = "";
      this.getProcessGroup();
    }
  }

  setPage(pageInfo) {

    this.paging.CurrentPage = pageInfo.offset + 1;
    this.getProcessGroup();

  }

  getProcessGroup() {
    this.isLoading = true;
    this.processSV.getPagingProcessGroup(this.paging).subscribe(data => {
      if (data && data.Data && data.Data.PageData) {
        this.listProcess = data.Data.PageData;
        this.totalRecord = data.Data.TotalRecord;
      }
      this.isLoading = false;
    });
  }

  setSort(event) {
    this.paging.Sort = event.sorts[0]?.dir;
    this.paging.SortBy = event.sorts[0]?.prop;
    this.getProcessGroup();
  }

  addNewProcessGroup(ref){
    if(!this.newGroup.ProcessGroupName || !this.newGroup.ProcessGroupName?.trim()){
      this.newGroup.Empty = true;
      return;
    }
    this.loadingUpdate = true;
    
    this.processSV.addProcessGroup(this.newGroup).subscribe(data => {
      if (data && data.Data && data.Data) {
        this.listProcess.unshift(data.Data);
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
    this.router.navigateByUrl(`pages/process-group/${e.selected[0].ProcessGroupId}`);
  }
}

