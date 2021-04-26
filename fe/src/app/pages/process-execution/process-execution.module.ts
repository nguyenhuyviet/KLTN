import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessExecutionComponent } from './process-execution.component';
import { NbCardModule, NbIconModule, NbInputModule, NbButtonModule, NbFormFieldModule } from '@nebular/theme';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ThemeModule } from '../../@theme/theme.module';
import { StepExecutionViewModule } from '../../shared/components/step-execution-view/step-execution-view.module';



@NgModule({
  declarations: [ProcessExecutionComponent],
  imports: [
    CommonModule,
    NbCardModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    NbButtonModule,
    NgxDatatableModule,
    NbFormFieldModule,
    StepExecutionViewModule
  ],
})
export class ProcessExecutionModule { }
