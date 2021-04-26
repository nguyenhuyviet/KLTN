import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessDoneComponent } from './process-done.component';
import { NbCardModule, NbIconModule, NbInputModule, NbButtonModule, NbFormFieldModule } from '@nebular/theme';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ThemeModule } from '../../@theme/theme.module';
import { ListProcessDoneModule } from './list-step-done/list-process-done.module';
import { ProcessDoneRoutingModule } from './process-done-routing.module';



@NgModule({
  declarations: [ProcessDoneComponent],
  imports: [
    CommonModule,
    ProcessDoneRoutingModule,
    ListProcessDoneModule,
    NbCardModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    NbButtonModule,
    NgxDatatableModule,
    NbFormFieldModule
  ]
})
export class ProcessDoneModule { }
