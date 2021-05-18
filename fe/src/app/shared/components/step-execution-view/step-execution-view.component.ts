import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { FieldType } from '../../../enums/field-type.enum';
import { ProcessExeStatusEnum } from '../../../enums/process-exe.enum';
import { ProcessExecution } from '../../../models/process-exe';
import { ProcessExecutionService } from '../../../services/process-exe.service';
import { ProcessService } from '../../../services/process.service';
import { ConvertMinutes, GetDiffDayMinute, showToast } from '../../fn/common.fn';

@Component({
  selector: 'ngx-step-execution-view',
  templateUrl: './step-execution-view.component.html',
  styleUrls: ['./step-execution-view.component.scss'],
})
export class StepExecutionViewComponent implements OnInit, OnDestroy {

  @Input() processId;

  @Input() fistStep = false;

  @Output() onBack = new EventEmitter();

  listPrevStep;

  isLoading = false;
  isLoadingAssignee = false;
  step;

  processName;

  processExeStatus;

  listAssignee;

  assingeeID;
  errAssignee = false;

  loadingDetailStep = false;
  currentDetailStep;

  newProcessExe = new ProcessExecution();

  processExeStatusEnum = ProcessExeStatusEnum;

  stepExeData = {

  };
  intervalRedirect;
  refuseReasonEmpty = false;
  refuseReason = '';
  isHandle;
  constructor(
    private processSV: ProcessService,
    private processExeSV: ProcessExecutionService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private router: Router
  ) { }
  ngOnDestroy(): void {
    if (this.intervalRedirect) {
      clearTimeout(this.intervalRedirect)
    }
  }

  ngOnInit(): void {
    if (this.fistStep) {

      this.getFirstStep();
    } else {
      this.getStepExecution();
    }
  }


  getFirstStep() {
    this.isLoading = true;

    this.processSV.getFirstStep(this.processId).subscribe(data => {
      if (data && data.Data) {
        this.step = data.Data;
        this.isHandle = true;
        if (this.step.StepFields) {
          this.step.StepFields.forEach(x => {
            x.DataSettingObj = JSON.parse(x.DataSetting);
          })
        }
      }
      this.isLoading = false;
    });
  }

  getStepExecution() {
    this.isLoading = true;

    this.processExeSV.getStepExecution(this.processId).subscribe(data => {
      if (data && data.Data) {
        this.processName = data.Data.ProcessName;
        this.processExeStatus = data.Data.Status;
        this.step = data.Data.CurrentStep;
        this.listPrevStep = data.Data.ListStep;
        this.isHandle = data.Data.IsHandle;
        if (this.step) {
          if (this.step.HasDeadline && this.step.DeadLine) {
            this.BuildDeadline();
          }
          if (this.step.StepFields) {
            this.step.StepFields.forEach(x => {
              x.DataSettingObj = JSON.parse(x.DataSetting);
            })
          }
        }
      }
      this.isLoading = false;
    });
  }

  BuildDeadline() {
    const dateDealine = new Date(this.step.StepExecutions[0]?.CreatedDate);
    const now = new Date();
    const diff = GetDiffDayMinute(dateDealine, now);

    const remain = this.step.DeadLine - diff;

    if (remain <= 0) {
      this.step.OverDeadline = true;
      return;
    }

    const deadline = ConvertMinutes(remain);
    this.step.Day = deadline.day;
    this.step.Hour = deadline.hour;
    this.step.Minute = deadline.minute;
  }

  backToProcess() {
    this.onBack.emit();
  }


  resetError() {
    this.errAssignee = false;
  }
  openSelectAssignee(dialog: TemplateRef<any>) {
    if (this.validateRequiredField()) {
      return;
    }
    this.dialogService.open(dialog);
    this.getAssigne();

  }
  openRefuseStep(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog);
  }

  initProcessExecution(ref) {
    if (!this.assingeeID) {
      this.errAssignee = true;
      return;
    }
    let data = [];

    this.step.StepFields?.forEach(field => {
      data.push(field.FieldValue)
    });

    const dataReq = {
      ProcessSettingId: this.step.ProcessId,
      ProcessStepId: this.step.ProcessStepId,
      AssigneeId: this.assingeeID,
      StepExecutionData: JSON.stringify(data),
    }

    this.processExeSV.initProcessExe(dataReq).subscribe(data => {
      if (data && data.Data) {
        showToast(this.toastrService, "Xử lý thành công", "success");
        ref.close();
        this.intervalRedirect = setTimeout(() => {
          this.router.navigateByUrl(`pages/process-done`);
        }, 2000);
      } else {
        showToast(this.toastrService, "Đã có lỗi xảy ra", "danger");
      }
    });

  }

  nextStep(ref) {
    if (!this.assingeeID) {
      this.errAssignee = true;
      return;
    }
    let data = [];

    this.step.StepFields?.forEach(field => {
      data.push(field.FieldValue)
    });

    const dataReq = {
      ProcessSettingId: this.step.ProcessId,
      ProcessStepId: this.step.ProcessStepId,
      AssigneeId: this.assingeeID,
      StepExecutionData: JSON.stringify(data),
      ProcessExeId: this.step.StepExecutions[0]?.ProcessExecutionId,
    }

    this.processExeSV.nextStep(dataReq).subscribe(data => {
      if (data && data.Data) {
        showToast(this.toastrService, "Xử lý thành công", "success");
        ref.close();
        this.intervalRedirect = setTimeout(() => {
          this.router.navigateByUrl(`pages/process-done`);
        }, 2000);
      } else {
        if (data.Code == 2) {
          showToast(this.toastrService, data.Message, "danger");
        } else {
          showToast(this.toastrService, "Đã có lỗi xảy ra", "danger");
        }
      }
    });

  }

  refuseStep(ref) {
    if (!this.refuseReason?.trim()) {
      this.refuseReasonEmpty = true;
      return;
    }

    const dataReq = {
      ProcessSettingId: this.step.ProcessId,
      ProcessStepId: this.step.ProcessStepId,
      RejectReason: this.refuseReason,
      ProcessExeId: this.step.StepExecutions[0]?.ProcessExecutionId,
    }

    this.processExeSV.refuseStep(dataReq).subscribe(data => {
      if (data && data.Data) {
        showToast(this.toastrService, "Xử lý thành công", "success");
        ref.close();
        this.intervalRedirect = setTimeout(() => {
          this.router.navigateByUrl(`pages/process-done`);
        }, 2000);
      } else {
        if (data.Code == 2) {
          showToast(this.toastrService, data.Message, "danger");
        } else {
          showToast(this.toastrService, "Đã có lỗi xảy ra", "danger");
        }
      }
    });
  }


  doneProcess(ref) {
    let data = [];

    this.step.StepFields?.forEach(field => {
      data.push(field.FieldValue)
    });

    const dataReq = {
      ProcessSettingId: this.step.ProcessId,
      ProcessStepId: this.step.ProcessStepId,
      AssigneeId: this.assingeeID,
      StepExecutionData: JSON.stringify(data),
      ProcessExeId: this.listPrevStep[0].ProcessExecutionId,
    }

    this.processExeSV.nextStep(dataReq).subscribe(data => {
      if (data && data.Data) {
        showToast(this.toastrService, "Xử lý thành công", "success");
        ref.close();
        this.intervalRedirect = setTimeout(() => {
          this.router.navigateByUrl(`pages/process-done`);
        }, 2000);
      } else {
        if (data.Code == 2) {
          showToast(this.toastrService, data.Message, "danger");
        } else {
          showToast(this.toastrService, "Đã có lỗi xảy ra", "danger");
        }
      }
    });
  }

  getAssigne() {
    this.isLoadingAssignee = true;
    this.processSV.getListAssignee(this.step).subscribe(data => {
      if (data && data.Data) {
        this.listAssignee = data.Data;
      }
      this.isLoadingAssignee = false;
    });



  }


  showDetailStepPrev(dialog, item) {
    this.dialogService.open(dialog);
    this.loadingDetailStep = true;
    this.processSV.getStepById(item.ProcessStepId).subscribe(data => {
      if (data && data.Data) {
        this.currentDetailStep = data.Data;
        this.currentDetailStep.StepExe = item;
        if (this.currentDetailStep.StepFields) {
          const fieldVal = JSON.parse(item.StepExecutionData);
          this.currentDetailStep.StepFields.forEach(x => {
            x.DataSettingObj = JSON.parse(x.DataSetting);
            x.FieldValue = fieldVal?.find(val => val.StepFieldId == x.StepFieldId);
          })
        }
      }

      this.loadingDetailStep = false;

    });
  }



  validateRequiredField() {
    let invalid = false;

    if (this.step && this.step.StepFields) {
      this.step.StepFields.forEach(x => {
        if (x.Type == FieldType.ShortText || x.Type == FieldType.LongText
          || x.Type == FieldType.Number || x.Type == FieldType.DateTime
          || x.Type == FieldType.Hour || x.Type == FieldType.Date || x.Type == FieldType.Dropdown) {

          if (x.IsRequired && (!x.FieldValue.Value || (x.Type == !FieldType.Dropdown && x.FieldValue.Value && !x.FieldValue.Value.trim()))) {
            x.FieldValue.Empty = true;
            invalid = true;
          }
        }
      })
    }

    return invalid;
  }
}
