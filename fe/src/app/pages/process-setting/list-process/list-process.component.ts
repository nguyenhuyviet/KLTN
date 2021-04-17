import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { ProcessStatusEnum } from '../../../enums/process-status.enum';
import { Paging } from '../../../models/paging';
import { ProcessService } from '../../../services/process.service';


@Component({
  selector: 'app-list-Process',
  templateUrl: './list-Process.component.html',
  styleUrls: ['./list-Process.component.scss']
})
export class ListProcessComponent implements OnInit {

  listProcess = [];
  isLoading = false;

  paging = new Paging();

  totalRecord;


  columnMode = ColumnMode;
  colummSetting = [
    { name: 'Tên quy trình', sortable: true, prop: "ProcessName", width: 250 },
    { name: 'Mô tả', sortable: true, prop: "Description", width: 400 },
    { name: 'Trạng thái', sortable: true, prop: "ProcessStatus", width: 150 },
    { name: 'Nhóm quy trình', sortable: false, prop: "ProcessGroup.ProcessGroupName", width: 150 },
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

  constructor(
    private router: Router,
    private processSV: ProcessService,
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
        this.getProcess();
      }, 1000);
    
  }

  clearSearch() {
    if(this.paging.FilterString != ""){
      this.paging.FilterString = "";
      this.getProcess();
    }
  }

  setPage(pageInfo) {

    this.paging.CurrentPage = pageInfo.offset + 1;
    this.getProcess();

  }

  getProcess() {
    this.isLoading = true;
    this.processSV.getPagingProcess(this.paging).subscribe(data => {
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
    this.getProcess();
  }
}
