import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { FieldType } from '../../../enums/field-type.enum';
import { ProcessExecution } from '../../../models/process-exe';
import { ProcessExecutionService } from '../../../services/process-exe.service';
import { ProcessService } from '../../../services/process.service';
import { ConvertMinutes, GetDiffDayMinute } from '../../fn/common.fn';

@Component({
  selector: 'ngx-step-execution-view',
  templateUrl: './step-execution-view.component.html',
  styleUrls: ['./step-execution-view.component.scss'],
})
export class StepExecutionViewComponent implements OnInit {

  @Input() processId;

  @Input() fistStep = false;

  @Output() onBack = new EventEmitter();

  listPrevStep;

  isLoading = false;
  isLoadingAssignee = false;
  step;

  listAssignee;

  assingeeID;
  errAssignee = false;

  loadingDetailStep = false;
  currentDetailStep;

  newProcessExe = new ProcessExecution();

  stepExeData = {

  };

  constructor(
    private processSV: ProcessService,
    private processExeSV: ProcessExecutionService,
    private dialogService: NbDialogService,
  ) { }

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
        this.step = data.Data.CurrentStep;
        this.listPrevStep = data.Data.ListStep;

        if(this.step.HasDeadline && this.step.DeadLine){
          this.BuildDeadline();
        }
        if (this.step && this.step.StepFields) {
          this.step.StepFields.forEach(x => {
            x.DataSettingObj = JSON.parse(x.DataSetting);
          })
        }
      }
      this.isLoading = false;
    });
  }

  BuildDeadline() {
    const dateDealine = new Date(this.step.CreatedDate);
    const now = new Date();
    const diff = GetDiffDayMinute(dateDealine, now);

    const remain = this.step.DeadLine - diff;
    
    if(remain <= 0){
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
    if(this.validateRequiredField()){
      return;
    }
    this.dialogService.open(dialog);
    this.getAssigne();

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
      StepExecutionData: JSON.stringify(data)
    }

    this.processExeSV.initProcessExe(dataReq).subscribe(data => {
      if (data && data.Data) {
        ref.close();
      }
    });

  }

  refuseStep() {

  }


  doneProcess(ref){
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
        ref.close();
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


  showDetailStepPrev(dialog, item){
    this.dialogService.open(dialog);
    this.loadingDetailStep = true;
    this.processSV.getStepById(item.ProcessStepId).subscribe(data => {
      if (data && data.Data) {
        this.currentDetailStep = data.Data;
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



  validateRequiredField(){
    let invalid = false;
    
    if (this.step && this.step.StepFields) {
      this.step.StepFields.forEach(x => {
          if(x.Type == FieldType.ShortText || x.Type == FieldType.LongText 
            || x.Type == FieldType.Number || x.Type == FieldType.DateTime 
            || x.Type == FieldType.Hour ||x.Type == FieldType.Date || x.Type == FieldType.Dropdown){
            
              if(x.IsRequired && ( !x.FieldValue.Value || (x.Type == !FieldType.Dropdown && x.FieldValue.Value && !x.FieldValue.Value.trim()))){
                x.FieldValue.Empty = true;
                invalid = true;
              }
          }
      })
    }

    return invalid;
  }
}
