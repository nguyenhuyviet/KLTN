import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { ColumnMode,SelectionType } from '@swimlane/ngx-datatable';
import { ProcessStatusEnum } from '../../enums/process-status.enum';
import { Paging } from '../../models/paging';
import { ProcessService } from '../../services/process.service';


@Component({
  selector: 'app-process-execution',
  templateUrl: './process-execution.component.html',
  styleUrls: ['./process-execution.component.scss']
})
export class ProcessExecutionComponent implements OnInit {

  listProcess = [];
  isLoading = false;

  paging = new Paging();

  totalRecord;

  viewListProcess = true;

  columnMode = ColumnMode;
  selectionType = SelectionType;

  colummSetting = [
    { name: 'Tên quy trình', sortable: true, prop: "ProcessName", width: 250 },
    { name: 'Mô tả', sortable: true, prop: "Description", width: 400 },
    { name: 'Nhóm quy trình', sortable: false, prop: "ProcessGroup.ProcessGroupName", width: 150 },
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


  currentProcess;

  constructor(
    private router: Router,
    private processSV: ProcessService,
  ) {
    this.paging.CurrentPage = 1;
    this.paging.PageSize = 10;
    this.paging.FilterString = "";
    this.paging.ExtraCondition = {
      StatusValue: 1
    };
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


  backToProcess(){
    this.viewListProcess = true;
  }

  onSelectRow(e){
    this.currentProcess = e.selected[0];
    this.viewListProcess = false;
  }


 
}
