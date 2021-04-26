import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessRelatedMeComponent } from './process-related-me.component';
import { ProcessRoutingModule } from './process-related-me-routing.module';
import { ListProcessRelatedModule } from './list-process-related/list-process-related.module';
import { NbCardModule, NbIconModule, NbInputModule, NbButtonModule, NbFormFieldModule } from '@nebular/theme';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ThemeModule } from '../../@theme/theme.module';
import { StepHandleModule } from './step-handle/step-handle.module';



@NgModule({
  declarations: [ProcessRelatedMeComponent],
  imports: [
    CommonModule,
    ProcessRoutingModule,
    ListProcessRelatedModule,
    StepHandleModule,
    NbCardModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    NbButtonModule,
    NgxDatatableModule,
    NbFormFieldModule
  ]
})
export class ProcessRelatedMeModule { }
