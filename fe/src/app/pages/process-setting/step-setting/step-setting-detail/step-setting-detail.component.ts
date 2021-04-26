import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { FormMode } from '../../../../enums/form-mode.enum';
import { Step } from '../../../../models/step';
import * as _ from "lodash";
import { ConvertMinutes } from '../../../../shared/fn/common.fn';
import { Output } from '@angular/core';

@Component({
  selector: 'ngx-step-setting-detail',
  templateUrl: './step-setting-detail.component.html',
  styleUrls: ['./step-setting-detail.component.scss']
})
export class StepSettingDetailComponent implements OnInit {


  _stepData;
  @Input()
  get stepData() {
    return this._stepData;
  }
  set stepData(value) {
    this._stepData = _.cloneDeep(value);
    this.prepareData();
  }

  @Input() isFirstStep;

  @Input() readonly;

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

  editEntities;

  deadline = {
    day: null,
    hour: null,
    minute: null
  }

  @Output() onSave: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();
  
  constructor() { }

  ngOnInit(): void {
  }

  test(e){
    console.log(e);
    
  }
  prepareData() {
    if (!this.stepData) {
      this.newStep = new Step();
    } else {
      this.newStep = _.cloneDeep(this.stepData);
      const deadLine = this.newStep.DeadLine;

      let deadlineCv = ConvertMinutes(deadLine);
      this.deadline.day = deadlineCv.day;
      this.deadline.hour = deadlineCv.hour;
      this.deadline.minute = deadlineCv.minute;
    }

    this.editEntities = {
      EditTask: false,
      EditAssignee: false,
      EditDeadline: false,
      EditField: false,
    };
  

  }

  resetError(a, b) {

  }

  saveDeadline() {
    if(this.readonly){
      return;
    }

    const nDeadLine = this.deadline.day * 60 * 24 + this.deadline.hour * 60 + this.deadline.minute;
    this.newStep.DeadLine = nDeadLine;
    this.editEntities.EditDeadline = false;
    this.calculatorDeadline();


  }

  cancelDeadline() {
    this.editEntities.EditDeadline = false;
    this.calculatorDeadline();
  }

  calculatorDeadline() {
    const deadLine = this.newStep.DeadLine;

    let deadlineCv = ConvertMinutes(deadLine);
    this.deadline.day = deadlineCv.day;
    this.deadline.hour = deadlineCv.hour;
    this.deadline.minute = deadlineCv.minute;
  }

  saveAssignee(e) {
    if(this.readonly){
      return;
    }

    this.newStep.StepAssignees = e;
    this.editEntities.EditAssignee = false;

  }

  cancelAssignee() {
    this.editEntities.EditAssignee = false;
  }

  saveTask(e) {
    if(this.readonly){
      return;
    }

    this.newStep.StepTasks = e;
    this.editEntities.EditTask = false;

  }

  cancelTask() {
    this.editEntities.EditTask = false;
  }


  saveField(e) {
    if(this.readonly){
      return;
    }

    this.newStep.StepFields = e;
    this.editEntities.EditField = false;

  }

  cancelField() {
    this.editEntities.EditField = false;
  }

  handleEdit(type) {
    switch (type) {
      case 'assignee':
        this.editEntities.EditAssignee = true;
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

  saveStep(){
    this.onSave.emit(this.newStep);
  }

  cancelStep(){
    this.newStep = _.cloneDeep(this.stepData);
    
    this.editEntities = {
      EditTask: false,
      EditAssignee: false,
      EditDeadline: false,
      EditField: false,
    };

    this.onCancel.emit();
  }

}
