import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepHandleComponent } from './step-handle.component';
import { FormsModule } from '@angular/forms';
import { NbCardModule, NbIconModule, NbButtonModule, NbSelectModule, NbSpinnerModule } from '@nebular/theme';
import { FieldViewModule } from '../../../shared/components/field-view/field-view.module';
import { StepExecutionViewModule } from '../../../shared/components/step-execution-view/step-execution-view.module';



@NgModule({
  declarations: [StepHandleComponent],
  imports: [
    CommonModule,
    NbCardModule,
    NbIconModule,
    FieldViewModule,
    NbButtonModule,
    NbSelectModule,
    NbSpinnerModule,
    FormsModule,
    StepExecutionViewModule
  ]
})
export class StepHandleModule { }
