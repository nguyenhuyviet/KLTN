import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormMode } from '../../../../../../enums/form-mode.enum';
import * as _ from "lodash";
import { StepField } from '../../../../../../models/step-field';
import { FieldType, FieldTypeEntity } from '../../../../../../enums/field-type.enum';
import { DropdownOption } from '../../../../../../models/dropdown-option';
@Component({
  selector: 'ngx-form-add-field',
  templateUrl: './form-add-field.component.html',
  styleUrls: ['./form-add-field.component.scss']
})
export class FormAddFieldComponent implements OnInit {
  @Input() formMode = FormMode.Insert;

  @Input() fieldData;

  newField;

  formModeEnum = FormMode;

  errorName = false;
  errorType = false;

  listFieldEntity = FieldTypeEntity;

  fieldType = FieldType;

  newDropDownOption = new DropdownOption();

  isshowInputAddOption = false;

  @Output() onSave = new EventEmitter();
  @Output() onCancel = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
    this.prepareData();
  }

  prepareData() {
    if (this.fieldData) {
      this.newField = _.cloneDeep(this.fieldData);
    }
  }

  resetError(a, b) {

  }


  save() {
    this.onSave.emit(this.newField);
    this.newField = new StepField();
  }
  cancel() {
    this.onCancel.emit();
  }



  showInputAddOption(e) {
    this.isshowInputAddOption = true;
  }

  hideInputAddOption() {
    this.isshowInputAddOption = false;

  }

  addDropDownOption() {
    if (this.newDropDownOption.OptionName && this.newDropDownOption.OptionName.trim() && this.newField.DataSettingObj.ListOption) {
      this.newField.DataSettingObj.ListOption.push(this.newDropDownOption);
      this.newDropDownOption = new DropdownOption();
    }
  }

  deleteDropdownOption(index) {
    if(this.newField.DataSettingObj.ListOption){
      this.newField.DataSettingObj.ListOption.splice(index, 1);
    }
  }
}
