import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldViewComponent } from './field-view.component';
import { FormsModule } from '@angular/forms';
import { NbCardModule, NbButtonModule, NbSelectModule, NbInputModule, NbSpinnerModule, NbTimepickerModule, NbDatepickerModule, NbCheckboxModule, NbToggleModule } from '@nebular/theme';



@NgModule({
  declarations: [FieldViewComponent],
  imports: [
    CommonModule,
    NbCardModule, 
    NbButtonModule, 
    NbSelectModule,
    NbInputModule,
    NbSpinnerModule,
    FormsModule,
    NbTimepickerModule,
    NbDatepickerModule,
    NbCheckboxModule,
    NbToggleModule
  ],
  exports:[FieldViewComponent]
})
export class FieldViewModule { }
