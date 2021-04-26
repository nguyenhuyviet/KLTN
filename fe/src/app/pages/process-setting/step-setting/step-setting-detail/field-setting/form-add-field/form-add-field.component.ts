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

  error = {
    ErrFieldName: false,
    ErrLinkName: false,
    ErrLinkTo: false,
    ErrOption: false,
    ErrType: false
  }

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

  resetError(type) {
    switch (type) {
      case 'field-name':
        if (this.error.ErrFieldName) {
          this.error.ErrFieldName = false;
        }
        break;
      case 'link-name':
        if (this.error.ErrLinkName) {
          this.error.ErrLinkName = false;
        }

        break;
      case 'link-to':
        if (this.error.ErrLinkTo) {
          this.error.ErrLinkTo = false;
        }

        break;
      case 'option-dropdown':
        if (this.error.ErrOption) {
          this.error.ErrOption = false;
        }
        break;

      default:
        break;
    }
  }


  save() {
    if (this.validate(this.newField.Type)) {
      return;
    }
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
    if (this.newField.DataSettingObj.ListOption) {
      this.newField.DataSettingObj.ListOption.splice(index, 1);
    }
  }

  validate(type) {
    this.error.ErrFieldName = false;
    this.error.ErrLinkName = false;
    this.error.ErrLinkTo = false;
    this.error.ErrOption = false;
    this.error.ErrType = false;
    let inValid = false;

    if (!this.newField.FieldName || (this.newField.FieldName && !this.newField.FieldName.trim())) {
      this.error.ErrFieldName = true;
      inValid = true;

    }

    switch (type) {
      case this.fieldType.Dropdown:
      case this.fieldType.Checkbox:
        if (this.isshowInputAddOption && !this.newDropDownOption.OptionName || (this.newDropDownOption.OptionName && !this.newDropDownOption.OptionName.trim())) {
          this.error.ErrOption = true;
          inValid = true;
        }
        break;
      case this.fieldType.Link:
        if (!this.newField.DataSettingObj.LinkName || (this.newField.DataSettingObj.LinkName && !this.newField.DataSettingObj.LinkName.trim())) {
          this.error.ErrLinkName = true;
          inValid = true;
        }
        if (!this.newField.DataSettingObj.LinkTo || (this.newField.DataSettingObj.LinkTo && !this.newField.DataSettingObj.LinkTo.trim())) {
          this.error.ErrLinkTo = true;
          inValid = true;
        }
        break;
      default:
        break;
    }


    return inValid;
  }
}
