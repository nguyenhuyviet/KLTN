import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { ColumnMode,SelectionType } from '@swimlane/ngx-datatable';
import { ProcessStatusEnum } from '../../../enums/process-status.enum';
import { Paging } from '../../../models/paging';
import { ProcessExecutionService } from '../../../services/process-exe.service';
import { ProcessService } from '../../../services/process.service';

@Component({
  selector: 'ngx-list-process-related',
  templateUrl: './list-process-related.component.html',
  styleUrls: ['./list-process-related.component.scss']
})
export class ListProcessRelatedComponent implements OnInit {

  listProcessExecution = [];

  isLoading = false;

  paging = new Paging();

  totalRecord;

  viewListProcess = true;

  listProcess;

  columnMode = ColumnMode;
  selectionType = SelectionType;

  colummSetting = [
    { name: 'Tên quy trình', sortable: false, prop: "ProcessName", width: 150 },
    { name: 'Bước hiện tại', sortable: false, prop: "CurrentStepName", width: 150 },
    { name: 'Mô tả', sortable: false, prop: "StepDescription", width: 200 },
    { name: 'Người tạo', sortable: false, prop: "OwnerName", width: 100 },
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
    private processExeSV: ProcessExecutionService,
  ) {
    this.paging.CurrentPage = 1;
    this.paging.PageSize = 10;
    this.paging.FilterString = "";
    this.paging.ExtraCondition = {
      Status: 1
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
    this.processExeSV.getNeedMyApproval(this.paging).subscribe(data => {
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
    this.router.navigateByUrl(`pages/process-related/handle/${this.currentProcess.ProcessExecutionId}`);
    this.viewListProcess = false;
  }


 
}

 