import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FieldType } from '../../../enums/field-type.enum';

@Component({
  selector: 'ngx-field-view',
  templateUrl: './field-view.component.html',
  styleUrls: ['./field-view.component.scss']
})
export class FieldViewComponent implements OnInit {

  @Input() fieldData;

  @Input() readonly;


  fieldType = FieldType;
  
  constructor() { }

  ngOnInit(): void {
  }


}
