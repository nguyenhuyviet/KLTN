import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportStatisticComponent } from './report-statistic.component';
import { ReportStatisticRoutingModule } from './report-statistic-routing.module';
import { FormsModule } from '@angular/forms';
import { NbCardModule, NbIconModule, NbInputModule, NbButtonModule, NbFormFieldModule, NbSelectModule, NbSpinnerModule, NbAccordionModule } from '@nebular/theme';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ThemeModule } from '../../@theme/theme.module';
import { ListProcessStatisticComponent } from './list-process-statistic/list-process-statistic.component';



@NgModule({
  declarations: [ReportStatisticComponent, ListProcessStatisticComponent],
  imports: [
    CommonModule,
    ReportStatisticRoutingModule,
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
export class ReportStatisticModule { }
