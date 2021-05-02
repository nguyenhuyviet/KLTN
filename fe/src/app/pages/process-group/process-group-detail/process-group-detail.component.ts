
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { ProcessStatusEnum } from '../../../enums/process-status.enum';
import { Paging } from '../../../models/paging';
import { ProcessService } from '../../../services/process.service';
import { showToast } from '../../../shared/fn/common.fn';


@Component({
  selector: 'ngx-process-group-detail',
  templateUrl: './process-group-detail.component.html',
  styleUrls: ['./process-group-detail.component.scss']
})
export class ProcessGroupDetailComponent implements OnInit {

  processGroupID;
  processGroup;
  listProcess = [];
  isLoading = false;
  loadingUpdate = false;

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

  newGroup = {
    ProcessGroupName: '',
    Empty: false
  }

  selectionType = SelectionType;

  visibleListAddProcess = false;
  pagingAddProcess = new Paging();
  listAddProcessRes = [];
  prevScrollHeight = 0;
  listProcessSelected = [];
  currentProcessRemoveId;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private processSV: ProcessService,
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
      this.processGroupID = +params['id']; // (+) converts string 'id' to a number         
      if (this.processGroupID && !isNaN(this.processGroupID)) {
        this.getGroupDetail();
        this.setPage({ offset: 0 });
      } else {
        this.router.navigateByUrl("not-found");
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
      this.getProcess();
    }, 1000);

  }

  clearSearch() {
    if (this.paging.FilterString != "") {
      this.paging.FilterString = "";
      this.getProcess();
    }
  }

  setPage(pageInfo) {

    this.paging.CurrentPage = pageInfo.offset + 1;
    this.paging.ExtraCondition = {
      ProcessGroupId: this.processGroupID
    }
    this.getProcess();

  }
  getGroupDetail() {
    this.isLoading = true;
    this.processSV.getGroupById(this.processGroupID).subscribe(data => {
      if (data && data.Data && data.Data) {
        this.processGroup = data.Data;
      }
      this.isLoading = false;
    });
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

  updateProcessGroup(ref) {
    if (!this.newGroup.ProcessGroupName || !this.newGroup.ProcessGroupName?.trim()) {
      this.newGroup.Empty = true;
      return;
    }
    this.loadingUpdate = true;
    this.processGroup.ProcessGroupName = this.newGroup.ProcessGroupName;
    this.processSV.updateProcessGroup(this.processGroup).subscribe(data => {
      if (data && data.Data && data.Data) {
        this.processGroup = data.Data;
      }
      this.loadingUpdate = false;
    });

    ref.close();
  }

  showDialogUpdateGroup(dialog) {
    this.newGroup.ProcessGroupName = this.processGroup.ProcessGroupName;
    this.dialogService.open(dialog);
  }
  showDialogRemoveProcess(dialog, process) {
    this.currentProcessRemoveId = process.ProcessId;
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
    this.processSV.deleteProcessGroup(this.processGroupID).subscribe(data => {
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
      ProcessGroupId: this.processGroupID
    }
    this.processSV.getPagingProcessAddGroup(this.pagingAddProcess).subscribe(data => {
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


    if (this.listProcessSelected) {

      if (process.IsChecked) {

        this.listProcessSelected.push(process);
      } else {
        this.listProcessSelected = this.listProcessSelected.filter(x => x.ProcessId != process.ProcessId);
      }
    }
  }

  addProcessToGroup(ref){
    if (!this.listProcessSelected || this.listProcessSelected?.length == 0) {
      return;
    }
    this.loadingUpdate = true;
    let processGroupReq = this.processGroup;
    processGroupReq.Processes = this.listProcessSelected;
    this.processSV.addProcessToGroup(processGroupReq).subscribe(data => {
      if (data && data.Data && data.Data) {
        this.listProcess.unshift(...data.Data.Processes);
      }
      this.loadingUpdate = false;
      ref.close();
    });

   
  }

  removeProcess(ref){
    this.processSV.removeFromGroup(this.currentProcessRemoveId).subscribe(data => {
      if (data && data.Data && data.Data) {
        this.listProcess = this.listProcess.filter(x => x.ProcessId != data.Data.ProcessId);
      }
      this.loadingUpdate = false;
      ref.close();
    });

    
  }

  backToListGroup(){
    this.router.navigateByUrl(`pages/process-group`);
  }
}

