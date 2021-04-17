import { Component, Input, OnInit } from '@angular/core';
import { FormMode } from '../../../../enums/form-mode.enum';
import { Step } from '../../../../models/step';
import * as _ from "lodash";

@Component({
  selector: 'ngx-step-setting-detail',
  templateUrl: './step-setting-detail.component.html',
  styleUrls: ['./step-setting-detail.component.scss']
})
export class StepSettingDetailComponent implements OnInit {

  @Input() formMode = FormMode.Insert;

  _stepData;
  @Input() 
  get stepData(){
    return this._stepData;
  }
  set stepData(value){
    this._stepData = _.cloneDeep(value);
    this.prepareData();
  }

  @Input() isFirstStep;

  formModeEnum = FormMode;

  errorName

  newStep;

  isLoading = false;

  formModeEntities = {
    Task: FormMode.Insert,
    Field: FormMode.Insert,
    Assignee: FormMode.Insert,
    Deadline: FormMode.Insert,
  };

  editEntities = {
    EditTask: false,
    EditAssignee: false,
    EditDeadline: false,
    EditField: false,
  };

  deadline = {
    day: null,
    hour: null,
    minute: null
  }

  constructor() { }

  ngOnInit(): void {
  }

  prepareData() {
    if (this.formMode == this.formModeEnum.Insert) {
      this.prepareDataInsert();

    } else if (this.formMode == this.formModeEnum.Update) {
      this.prepareDataUpdate();
    }
  }
  prepareDataInsert() {
    this.newStep = new Step();
  }

  prepareDataUpdate() {
    if (!this.newStep) {
      this.newStep = new Step();
    } else {
      this.newStep = this.stepData;
    }

  }

  resetError(a, b) {

  }


  saveTask(e) {
    console.log(e);
    this.editEntities.EditTask = false;

  }

  cancelTask() {
    this.editEntities.EditTask = false;
  }


  saveField(e) {
    console.log(e);
    this.editEntities.EditField = false;

  }

  cancelField() {
    this.editEntities.EditField = false;
  }

  handleEdit(type) {
    switch (type) {
      case 'assignee':

        break;
      case 'task':
        this.editEntities.EditTask = true;
        break;
      case 'deadline':
        this.editEntities.EditDeadline = true;
        break;
      case 'field':
        this.editEntities.EditField = true;
        break;
      default:
        break;
    }
  }
}
