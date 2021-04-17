import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FormMode } from '../../../enums/form-mode.enum';

@Component({
  selector: 'ngx-update-process-dialog',
  templateUrl: './update-process-dialog.component.html',
  styleUrls: ['./update-process-dialog.component.scss']
})
export class UpdateProcessDialogComponent implements OnInit {

  formMode = FormMode;

  @Input() processData;

  constructor(protected ref: NbDialogRef<UpdateProcessDialogComponent>) {}

  ngOnInit(): void {
    
  }

  cancel() {
    this.ref.close();
  }

  submit(e) {
    this.ref.close(e);
  }
}
