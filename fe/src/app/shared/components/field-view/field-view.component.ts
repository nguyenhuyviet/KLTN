import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FieldType } from '../../../enums/field-type.enum';
import * as _ from 'lodash'

@Component({
  selector: 'ngx-field-view',
  templateUrl: './field-view.component.html',
  styleUrls: ['./field-view.component.scss']
})
export class FieldViewComponent implements OnInit {

  @Input() fieldData;

  @Input() readonly;


  fieldValue;


  fieldType = FieldType;


  constructor() { }

  ngOnInit(): void {
    if (this.fieldData) {

      if (!this.fieldData.FieldValue) {
        if (this.fieldData.Type == this.fieldType.Checkbox) {
          this.fieldData.FieldValue = {
            StepFieldId: this.fieldData.StepFieldId,
            ListOptionValue: []
          }

          this.fieldData.DataSettingObj?.ListOption?.forEach(option => {
            this.fieldData.FieldValue.ListOptionValue.push(
              {
                OptionId: option.OptionId,
                Value: null
              }
            )
          });
        } else {

          this.fieldData.FieldValue = {
            StepFieldId: this.fieldData.StepFieldId,
            Value: null,
          }
        }

      } else if (this.fieldData.Type == FieldType.Date || this.fieldData.Type == FieldType.DateTime || this.fieldData.Type == FieldType.Hour) {
        this.fieldData.FieldValue.Value = new Date(this.fieldData.FieldValue.Value ? this.fieldData.FieldValue.Value : null);
      } else if(this.fieldData.Type == FieldType.Checkbox) {

        this.fieldData.DataSettingObj?.ListOption?.forEach(option => {
          let optionData = this.fieldData.FieldValue?.ListOptionValue.find( x => x.OptionId == option.OptionId && x.Value == true)
          if(optionData){
            option.Value = true; 
          }
        });
      }
      this.fieldValue = this.fieldData.FieldValue;

    }

  }

  setValueChecked(option, e){
    let optionData = this.fieldData.FieldValue?.ListOptionValue.find( x => x.OptionId == option.OptionId)
    if(optionData){
      optionData.Value  = e;

    }else{
      this.fieldData.FieldValue.ListOptionValue.push(
        {
          OptionId: option.OptionId,
          Value: e
        })
    }
  }

  resetError(){
    if(!this.fieldValue.Value){
      return;
    }
    
    this.fieldValue.Empty = false;

  }
}
