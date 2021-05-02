import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessGroupComponent } from './process-group.component';
import { ProcessGroupRoutingModule } from './process-group-routing.module';
import { ListProcessGroupModule } from './list-process-group/list-process-group.module';
import { ProcessGroupDetailComponent } from './process-group-detail/process-group-detail.component';
import { FormsModule } from '@angular/forms';
import { NbCardModule, NbIconModule, NbInputModule, NbButtonModule, NbFormFieldModule, NbSelectModule, NbSpinnerModule, NbAccordionModule } from '@nebular/theme';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ThemeModule } from '../../@theme/theme.module';



@NgModule({
  declarations: [ProcessGroupComponent,ProcessGroupDetailComponent],
  imports: [
    CommonModule,
    ProcessGroupRoutingModule,
    ListProcessGroupModule,
    NbCardModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    NbButtonModule,
    NgxDatatableModule,
    NbFormFieldModule,
    NbSelectModule,
    NbSpinnerModule,
    FormsModule,
    NbAccordionModule
  ]
})
export class ProcessGroupModule { }
