import { Component, OnInit } from '@angular/core';
import { FormMode } from '../../../enums/form-mode.enum';

@Component({
  selector: 'app-process-setting',
  templateUrl: './process-setting.component.html',
  styleUrls: ['./process-setting.component.scss']
})
export class ProcessSettingComponent implements OnInit {

  formMode = FormMode;
  
  constructor() { }

  ngOnInit(): void {
  }

}
