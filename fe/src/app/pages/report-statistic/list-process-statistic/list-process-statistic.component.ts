import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { ProcessStatusEnum } from '../../../enums/process-status.enum';
import { Paging } from '../../../models/paging';
import { ProcessService } from '../../../services/process.service';
import { ConvertMinutes } from '../../../shared/fn/common.fn';


@Component({
  selector: 'ngx-list-process-statistic',
  templateUrl: './list-process-statistic.component.html',
  styleUrls: ['./list-process-statistic.component.scss']
})
export class ListProcessStatisticComponent implements OnInit {

  listProcess = [];
  isLoading = false;
  loadingUpdate = false;

  paging = new Paging();

  totalRecord;

  currentProcessStatisticDetail;
  columnMode = ColumnMode;
  colummSetting = [
    { name: 'Tên quy trình', sortable: true, prop: "ProcessName", width: 250 },
    { name: 'Mô tả', sortable: false, prop: "Description", width: 400 },
    { name: 'Người tạo', sortable: false, prop: "CreatedBy", width: 150 },
    { name: 'Số lượng đã chạy', sortable: true, prop: "NumberExecution", width: 150 },
    { name: 'Tỉ lệ hoàn thành', sortable: true, prop: "CompletionRate", width: 150 },
    { name: 'Tổng thời gian chạy', sortable: true, prop: "TotalTimeExecution", width: 150 },
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
      this.getProcessStatistic();
    }, 1000);

  }

  clearSearch() {
    if (this.paging.FilterString != "") {
      this.paging.FilterString = "";
      this.getProcessStatistic();
    }
  }

  setPage(pageInfo) {

    this.paging.CurrentPage = pageInfo.offset + 1;
    this.getProcessStatistic();

  }

  getProcessStatistic() {
    this.isLoading = true;
    this.processSV.getPagingProcessStatistic(this.paging).subscribe(data => {
      if (data && data.Data && data.Data.PageData) {
        this.listProcess = data.Data.PageData;
        this.totalRecord = data.Data.TotalRecord;
        if (this.listProcess) {

          this.listProcess.forEach(element => {
            const total = ConvertMinutes(element.TotalTimeExecution);
            element.Day = total.day;
            element.Hour = total.hour;
            element.Minute = total.minute;
          });
        }
      }
      this.isLoading = false;
    });
  }

  setSort(event) {
    this.paging.Sort = event.sorts[0]?.dir;
    this.paging.SortBy = event.sorts[0]?.prop;
    this.getProcessStatistic();
  }


  showDialogDetail(dialog, row) {

    this.dialogService.open(dialog);
    this.isLoading = true;
    this.processSV.getDetailProcessStatistic(row.ProcessId).subscribe(data => {
      if (data && data.Data) {
        this.currentProcessStatisticDetail = data.Data;

        const total = ConvertMinutes(this.currentProcessStatisticDetail.TotalTimeExecution);
        this.currentProcessStatisticDetail.Day = total.day;
        this.currentProcessStatisticDetail.Hour = total.hour;
        this.currentProcessStatisticDetail.Minute = total.minute;
      }
      this.isLoading = false;
    });

  }

  resetError() {
    this.newGroup.Empty = false;
  }

  onSelectRow(e) {
    this.router.navigateByUrl(`pages/process-statistic/${e.selected[0].ProcessId}`);
  }
}

