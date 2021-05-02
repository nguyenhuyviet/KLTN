import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListProcessGroupComponent } from './list-process-group.component';
import { NbCardModule, NbIconModule, NbInputModule, NbButtonModule, NbFormFieldModule, NbAccordionModule, NbSelectModule, NbSpinnerModule } from '@nebular/theme';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ThemeModule } from '../../../@theme/theme.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [ListProcessGroupComponent],
  imports: [
    CommonModule,
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
export class ListProcessGroupModule { }
