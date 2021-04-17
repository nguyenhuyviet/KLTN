import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormMode } from '../../../enums/form-mode.enum';
import { ProcessService } from '../../../services/process.service';
import * as _ from "lodash"
import { listProcessStatus } from '../../../enums/process-status.enum';

@Component({
  selector: 'ngx-process-setup',
  templateUrl: './process-setup.component.html',
  styleUrls: ['./process-setup.component.scss']
})
export class ProcessSetupComponent implements OnInit {

  @Input() formMode;

  @Input() processData;

  newProcess;
  listProcessGroup = [];
  titleForm = '';
  isLoading = false;
  isLoadingBtn = false;

  errorName = false;
  errorGroup = false;
  formModeEnum = FormMode;

  listProcessStatus = listProcessStatus;

  @Output() eventUpdate = new EventEmitter();

  constructor(
    private processSV: ProcessService
  ) { }

  ngOnInit(): void {
    this.getProcessGroup();


  }

  prepareData() {
    if (this.formMode == FormMode.Insert) {
      this.prepareInsert();
    } else if (this.formMode == FormMode.Update) {
      this.prepareUpdate();

    }
  }

  prepareInsert() {
    this.titleForm = "Tạo quy trình"
    this.newProcess = {
      ProcessName: '',
      Description: '',
      ProcessGroupId: null
    }
  }

  prepareUpdate() {
    this.titleForm = "Cập nhật quy trình"
    this.newProcess = _.cloneDeep(this.processData);
    this.newProcess.ProcessGroupId = this.newProcess?.ProcessGroupId
  }

  getProcessGroup() {
    this.isLoading = true;
    this.processSV.getAllProcessGroup().subscribe(data => {
      if (data && data.Data && data.Data.length > 0) {
        this.listProcessGroup = data.Data;
        this.prepareData();
      }
      this.isLoading = false;
    })
  }

  submitForm() {
    if (this.validate()) {
      return;
    }

    const process = {
      ProcessName: this.newProcess.ProcessName,
      Description: this.newProcess.Description,
      ProcessGroupId: this.newProcess.ProcessGroupId,
    }

    if (this.formMode === FormMode.Insert) {
      this.insertProcess(process);
    } else {
      this.updateProcess();

    }

  }

  insertProcess(process) {
    this.isLoadingBtn = true;
    this.processSV.addProcess(process).subscribe(data => {
      if (data && data.Data) {
        console.log(data.Data);
      }
      this.isLoadingBtn = false;

    })
  }

  updateProcess() {
    this.isLoadingBtn = true;

    this.processSV.updateProcess(this.newProcess).subscribe(data => {
      if (data && data.Data) {
        this.newProcess = data.Data;
        this.eventUpdate.emit(this.newProcess);
      }
      this.isLoadingBtn = false;

    })

  }

  validate() {
    this.errorGroup = false;
    this.errorName = false;
    let inValid = false;
    if (!this.newProcess.ProcessGroupId) {
      this.errorGroup = true;
      inValid = true;
    }

    if (!this.newProcess.ProcessName || (this.newProcess.ProcessName && !this.newProcess.ProcessName.trim())) {
      this.errorName = true;
      inValid = true;
    }

    return inValid;
  }

  resetError(isName = false) {
    if (isName) {
      this.errorName = false;
    } else {
      this.errorGroup = false;
    }
  }
}
