import { ElementRef, EventEmitter, ViewChild } from '@angular/core';
import { Component, Input, OnInit, Output } from '@angular/core';
import { FormMode } from '../../../../../enums/form-mode.enum';
import { StepTask } from '../../../../../models/step-task';
import * as _ from "lodash";

@Component({
  selector: 'ngx-task-setting',
  templateUrl: './task-setting.component.html',
  styleUrls: ['./task-setting.component.scss']
})
export class TaskSettingComponent implements OnInit {


  _taskData;
  @Input() 
  get taskData(){
    return this._taskData;
  }
  set taskData(value){
    
    this._taskData = _.cloneDeep(value);
    this.prepareData();
  }

  @Input() readonly = true;


  listNewTask = [];

  newTask = new StepTask();

  @Output() onSave: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();


  isShowInputStepTask = false;


  @ViewChild('inputTaskName') inputTaskName: ElementRef;


  constructor() { }

  ngOnInit(): void {
    
  }

  prepareData() {
    if (this.taskData) {
      this.listNewTask = _.cloneDeep(this.taskData);
    }else{

    }
  }

  showInputStepTask() {
    this.isShowInputStepTask = true;
    setTimeout(() => {
      if (this.inputTaskName) {
        this.inputTaskName.nativeElement.focus();
      }
    }, 300);
  }

  addTask() {
    if (this.newTask.TaskName && this.newTask.TaskName.trim()) {
      this.newTask.SortOrder = this.listNewTask.length;
      this.listNewTask.push(this.newTask);
      this.newTask = new StepTask();
    } else {

    }
  }


  hideInputAddTask(isEdit = false, index = null) {
    if (isEdit) {
      if (this.listNewTask) {
        this.listNewTask[index].State = 3;
      }
    } else {
      this.isShowInputStepTask = false;
    }
  }


  save() {
    this.onSave.emit(this.listNewTask);
  }
  cancel() {
    this.onCancel.emit();
    this.listNewTask = _.cloneDeep(this.taskData);
    this.isShowInputStepTask = false;
  }
}
