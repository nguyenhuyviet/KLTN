import { Component, ElementRef, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbComponentStatus, NbDialogService, NbToastrService } from '@nebular/theme';
import { FormMode } from '../../../enums/form-mode.enum';
import { listProcessStatus } from '../../../enums/process-status.enum';
import { Step } from '../../../models/step';
import { ProcessService } from '../../../services/process.service';
import { showToast } from '../../../shared/fn/common.fn';
import * as _ from "lodash";


@Component({
  selector: 'app-step-setting',
  templateUrl: './step-setting.component.html',
  styleUrls: ['./step-setting.component.scss']
})
export class StepSettingComponent implements OnInit {

  isLoading = false;
  isLoadingStep = false;
  processID = -1;
  currentProcess;
  newProcess = {
    ProcessName: '',
    ProcessStatus: 1,
  };
  isEditInput = false;
  isShowInputStepName = false;
  stepAddSidebarName = "";
  currentStep;
  formMode = FormMode;

  listProcessStatus = listProcessStatus;

  isUpdateStep = false;

  statusToast: NbComponentStatus
  @ViewChild('inputStepNameElm') inputStepNameElm: ElementRef;
  @ViewChild('inputProcessNameElm') inputProcessNameElm: ElementRef;

  constructor(
    private processSV: ProcessService,
    private route: ActivatedRoute,
    private router: Router,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService

  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.processID = +params['id']; // (+) converts string 'id' to a number         
      if (this.processID && !isNaN(this.processID)) {
        this.getAllStepByProcessID()
      } else {
        this.router.navigateByUrl("not-found");
      }
    });

    this.route.queryParamMap.subscribe(queryParams => {
      if (queryParams[`params`].stepId) {
        const stepID = +queryParams[`params`].stepId;
        if (!queryParams[`params`].isJustAdd) {
          this.getStepByID(stepID);
        }
      }
    });
  }



  getAllStepByProcessID() {
    this.isLoading = true;
    this.processSV.getAllStepByProcessID(this.processID).subscribe(data => {
      if (data && data.Data) {
        this.currentProcess = data.Data;
        this.newProcess.ProcessName = this.currentProcess.ProcessName;
        this.newProcess.ProcessStatus = this.currentProcess.ProcessStatus;
        if (this.currentProcess.ProcessSteps && this.currentProcess.ProcessSteps.length > 0) {
          this.currentStep = this.currentProcess.ProcessSteps[0];
        }
      }
      this.isLoading = false;
    });
  }

  showEditProcessName() {
    this.isEditInput = true;
    setTimeout(() => {
      if (this.inputProcessNameElm) {
        this.inputProcessNameElm.nativeElement.focus();
      }

    }, 300);
  }
  updateProcessName() {
    if (!this.newProcess.ProcessName && !this.newProcess.ProcessName.trim()) {
      return;
    }
    this.currentProcess.ProcessName = this.newProcess.ProcessName;

    this.processSV.updateProcess(this.currentProcess).subscribe(data => {
      if (data && data.Data) {
        showToast(this.toastrService, "Cập nhật thành công", "success");
      } else {
        showToast(this.toastrService, "Cập nhật thất bại", "danger");
      }
      this.isEditInput = false;
    });

  }
  updateProcessStatus() {
    if (!this.newProcess.ProcessStatus) {
      return;
    }
    this.currentProcess.ProcessStatus = this.newProcess.ProcessStatus;

    this.processSV.updateProcess(this.currentProcess).subscribe(data => {
      if (data && data.Data) {
        showToast(this.toastrService, "Cập nhật thành công", "success");
      } else {
        showToast(this.toastrService, "Cập nhật thất bại", "danger");
      }
    });
  }
  addSidebarStep() {
    if (!this.stepAddSidebarName && !this.stepAddSidebarName.trim()) {
      return;
    }

    const step = {
      ProcessId: this.currentProcess.ProcessId,
      ProcessStepName: this.stepAddSidebarName,
      SortOrder: this.currentProcess.ProcessSteps ? this.currentProcess.ProcessSteps[this.currentProcess.ProcessSteps.length - 1].SortOrder + 1 : 1
    };

    this.addStep(step);
    this.hideInputStepName();
  }

  addStep(step) {
    this.isLoading = true;
    this.processSV.addStep(step).subscribe(data => {
      if (data && data.Data) {
        if (!this.currentProcess.ProcessSteps) {
          this.currentProcess.ProcessSteps = [];
        }
        this.currentProcess.ProcessSteps.push(data.Data);
        this.currentStep = data.Data;
        this.router.navigate([`/pages/process/stepSetting/${this.currentProcess.ProcessId}`], { queryParams: { stepId: step.ProcessStepId, isJustAdd: true } });
      }
      this.isLoading = false;
    });
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (this.isShowInputStepName) {

      if (this.inputStepNameElm && this.inputStepNameElm.nativeElement.contains(event.target)) {

      } else if (this.stepAddSidebarName == "") {

        this.hideInputStepName();
      }
    }

  }
  showInputStepName(e) {
    e.preventDefault();
    e.stopPropagation();
    this.isShowInputStepName = true;

    setTimeout(() => {
      if (this.inputStepNameElm) {
        this.inputStepNameElm.nativeElement.focus();
      }

    }, 300);
  }
  hideInputProcessName() {
    this.isEditInput = false;
    this.newProcess.ProcessName = this.currentProcess.ProcessName;
  }
  hideInputStepName() {
    this.isShowInputStepName = false;
    this.stepAddSidebarName = "";
  }

  showStep(step) {
    this.router.navigate([`/pages/process/stepSetting/${this.currentProcess.ProcessId}`], { queryParams: { stepId: step.ProcessStepId } });
  }


  getStepByID(stepID) {
    this.isLoadingStep = true;
    this.processSV.getStepByID(this.processID, stepID).subscribe(data => {
      if (data && data.Data) {
        this.currentStep = data.Data;
      } else {
        this.router.navigateByUrl("not-found");

      }
      this.isLoadingStep = false;

    });
  }

  showUpdateStep() {
    this.isUpdateStep = true;

  }

  updateStep(e) {
    this.currentStep = e;
    this.isLoadingStep = true;
    this.processSV.updateStep(e).subscribe(data => {
      if (data && data.Data) {
        this.currentStep = data.Data;
        let index = this.currentProcess.ProcessSteps.findIndex(x => x.ProcessStepId == this.currentStep.ProcessStepId);
        if (index != -1) {
          this.currentProcess.ProcessSteps[index] = _.cloneDeep(this.currentStep);
        }
        showToast(this.toastrService, "Cập nhật thành công", "success");
      } else {
        showToast(this.toastrService, "Cập nhật thất bại", "danger");
      }
      this.isLoadingStep = false;
      this.isUpdateStep = false;

    });
  }


  cancelUpdateStep() {
    this.isUpdateStep = false;
  }

  openConfirmDelStep(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog);
  }

  delStep(ref) {
    this.processSV.deleteStep(this.currentStep.ProcessStepId).subscribe(data => {
      if (data && data.Data) {
        if (this.currentProcess.ProcessSteps && this.currentProcess.ProcessSteps.length > 0) {
          const index = this.currentProcess.ProcessSteps.findIndex(x => x.ProcessStepId == this.currentStep.ProcessStepId);
          this.currentProcess.ProcessSteps.splice(index, 1);
          const step = this.currentProcess.ProcessSteps[index > 0 ? index - 1 : 0];
          this.showStep(step);
        }
        // showToast(this.toastrService,"Xóa bước thành công", "success");
        ref.close();
        this.toastrService.show("", "ádasdasd", { "destroyByClick": true })
      } else {
        showToast(this.toastrService, "Xóa bước thất bại", "danger");
      }
    });
  }

  backToListProcess() {
    this.router.navigateByUrl(`pages/process`);
  }
}
