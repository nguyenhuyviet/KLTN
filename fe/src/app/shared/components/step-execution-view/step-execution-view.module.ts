import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepExecutionViewComponent } from './step-execution-view.component';
import { NbAccordionModule, NbButtonModule, NbCardModule, NbIconModule, NbSelectModule, NbSpinnerModule } from '@nebular/theme';
import { FieldViewModule } from '../field-view/field-view.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [StepExecutionViewComponent],
  imports: [
    CommonModule,
    NbCardModule,
    NbIconModule,
    FieldViewModule,
    NbButtonModule,
    NbSelectModule,
    NbSpinnerModule,
    FormsModule,
    NbAccordionModule
  ],
  exports: [StepExecutionViewComponent]
})
export class StepExecutionViewModule { }
